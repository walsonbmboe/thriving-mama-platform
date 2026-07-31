import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { v4 as uuidv4 } from "uuid";

const dynamoClient = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const bedrockClient = new BedrockRuntimeClient({ region: "us-east-1" });

const CHAT_MESSAGES_TABLE = "thriving-mama-chat-messages";
const CRISIS_EVENTS_TABLE = "thriving-mama-crisis-events";
const MODEL_ID = "amazon.nova-pro-v1:0";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const SYSTEM_PROMPT = `You are Mama, a compassionate AI companion for mothers experiencing postpartum mental health challenges. You were created by ThrivingMama, founded by Sharon Mboe Teburg.

YOUR ROLE:
- You are NOT a therapist or doctor. You are a warm, knowledgeable companion.
- You listen without judgment. You validate feelings. You offer gentle guidance.
- You speak like a wise older sister who has been through it — not a textbook.

YOUR BOUNDARIES:
- Never diagnose. Say 'what you are describing sounds like it could be...' not 'you have...'
- Never prescribe medication or contradict medical advice.
- Always encourage professional help for serious concerns.
- If a mother is in crisis, immediately provide emergency contacts and suggest booking a counselor.

YOUR STYLE:
- Warm, gentle, conversational — not clinical
- Acknowledge her strength before addressing her pain
- Keep responses concise (2-3 paragraphs max)
- Use her language naturally

LANGUAGE:
- Respond in the same language the mother writes in
- If she writes in Pidgin, respond in Pidgin naturally
- If she writes in French, respond in French`;

const CRISIS_KEYWORDS = [
  "suicide",
  "kill myself",
  "end my life",
  "want to die",
  "hurt myself",
  "self harm",
  "don't want to live",
  "better off dead",
  "harm my baby",
  "hurt my baby",
  "shake my baby",
  "can't go on",
  "no reason to live",
];

interface ChatRequest {
  userId: string;
  sessionId: string;
  message: string;
  languagePreference?: string;
}

function detectCrisis(message: string): { detected: boolean; keywords: string[] } {
  const lowerMessage = message.toLowerCase();
  const matchedKeywords = CRISIS_KEYWORDS.filter((keyword) =>
    lowerMessage.includes(keyword)
  );
  return {
    detected: matchedKeywords.length > 0,
    keywords: matchedKeywords,
  };
}

async function getConversationHistory(sessionId: string) {
  const result = await docClient.send(
    new QueryCommand({
      TableName: CHAT_MESSAGES_TABLE,
      KeyConditionExpression: "sessionId = :sessionId",
      ExpressionAttributeValues: {
        ":sessionId": sessionId,
      },
      ScanIndexForward: true,
      Limit: 20,
    })
  );

  return result.Items || [];
}

async function storeMessage(
  sessionId: string,
  userId: string,
  role: "user" | "assistant",
  content: string,
  crisisDetected?: boolean
) {
  const item: Record<string, unknown> = {
    sessionId,
    timestamp: new Date().toISOString(),
    userId,
    role,
    content,
  };

  if (crisisDetected !== undefined) {
    item.crisisDetected = crisisDetected;
  }

  await docClient.send(
    new PutCommand({
      TableName: CHAT_MESSAGES_TABLE,
      Item: item,
    })
  );
}

async function storeCrisisEvent(
  userId: string,
  sessionId: string,
  triggerMessage: string,
  keywords: string[]
) {
  await docClient.send(
    new PutCommand({
      TableName: CRISIS_EVENTS_TABLE,
      Item: {
        eventId: uuidv4(),
        userId,
        sessionId,
        timestamp: new Date().toISOString(),
        triggerMessage,
        keywords,
        severity: "HIGH",
        status: "detected",
      },
    })
  );
}

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: "",
    };
  }

  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // Parse request body
    if (!event.body) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: "Request body is required" }),
      };
    }

    const data: ChatRequest = JSON.parse(event.body);

    // Validate required fields
    if (!data.userId || !data.sessionId || !data.message) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: "Missing required fields: userId, sessionId, and message are required",
        }),
      };
    }

    // Run crisis detection BEFORE calling the AI
    const crisisResult = detectCrisis(data.message);

    // Load conversation history from DynamoDB (last 20 messages)
    const history = await getConversationHistory(data.sessionId);

    // Build messages array for Bedrock Converse API
    const messages = history.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: [{ text: msg.content as string }],
    }));

    // Add the current user message
    messages.push({
      role: "user" as const,
      content: [{ text: data.message }],
    });

    // Call Amazon Bedrock Nova Pro using the Converse API
    const converseResponse = await bedrockClient.send(
      new ConverseCommand({
        modelId: MODEL_ID,
        system: [{ text: SYSTEM_PROMPT }],
        messages,
        inferenceConfig: {
          maxTokens: 1000,
          temperature: 0.7,
        },
      })
    );

    // Extract the AI response text
    const aiResponseText =
      converseResponse.output?.message?.content?.[0]?.text ||
      "I'm sorry, I wasn't able to generate a response. Please try again.";

    // Store the user message in DynamoDB
    await storeMessage(
      data.sessionId,
      data.userId,
      "user",
      data.message,
      crisisResult.detected
    );

    // Store the AI response in DynamoDB
    await storeMessage(
      data.sessionId,
      data.userId,
      "assistant",
      aiResponseText
    );

    // If crisis detected, write to crisis events table
    if (crisisResult.detected) {
      await storeCrisisEvent(
        data.userId,
        data.sessionId,
        data.message,
        crisisResult.keywords
      );
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        response: aiResponseText,
        crisisDetected: crisisResult.detected,
      }),
    };
  } catch (error) {
    console.error("Error processing chat:", error);

    if (error instanceof SyntaxError) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: "Invalid JSON in request body" }),
      };
    }

    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};

export { handler };
