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

const awsCredentials = {
  accessKeyId: process.env.TM_AWS_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.TM_AWS_SECRET_ACCESS_KEY || "",
};

const dynamoClient = new DynamoDBClient({
  region: process.env.TM_AWS_REGION || "us-east-1",
  credentials: awsCredentials,
});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.TM_AWS_REGION || "us-east-1",
  credentials: awsCredentials,
});

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

const CRISIS_ASSESSMENT_PROMPT = `You are a crisis assessment system for a maternal mental health platform. Analyze the following message from a mother and classify the crisis risk level. Respond with ONLY one word: NONE, LOW, MEDIUM, or HIGH.

HIGH = Imminent danger to self or baby, active suicidal/homicidal ideation, specific plans to harm
MEDIUM = Expressions of hopelessness, passive suicidal thoughts, extreme distress without specific plans
LOW = General distress, frustration, sadness but no indication of danger
NONE = Normal conversation, seeking support, general questions

Message: `;

// Comprehensive crisis keywords list
const CRISIS_KEYWORDS = [
  // Self-harm
  "suicide",
  "kill myself",
  "end my life",
  "want to die",
  "hurt myself",
  "self harm",
  "self-harm",
  "don't want to live",
  "better off dead",
  "no reason to live",
  "can't go on",
  "end it all",
  "take my own life",
  "not worth living",
  "rather be dead",
  "wish I was dead",
  "wish i were dead",
  "cut myself",
  "overdose",
  // Baby harm
  "harm my baby",
  "hurt my baby",
  "shake my baby",
  "kill my baby",
  "killing my baby",
  "drop my baby",
  "throw my baby",
  "smother my baby",
  "drown my baby",
  "suffocate my baby",
  "don't want my baby",
  "hate my baby",
  "thought about hurting",
  // General crisis
  "can't take it anymore",
  "no way out",
  "nobody cares",
  "everyone would be better off without me",
  "i give up",
  "what's the point",
  "i can't do this anymore",
];

interface ChatRequest {
  userId: string;
  sessionId: string;
  message: string;
  languagePreference?: string;
}

interface CrisisResult {
  detected: boolean;
  severity: "NONE" | "LOW" | "MEDIUM" | "HIGH";
  keywords: string[];
  aiAssessed: boolean;
}

function keywordScan(message: string): { matched: boolean; keywords: string[] } {
  const lowerMessage = message.toLowerCase();
  const matchedKeywords = CRISIS_KEYWORDS.filter((keyword) =>
    lowerMessage.includes(keyword.toLowerCase())
  );
  return {
    matched: matchedKeywords.length > 0,
    keywords: matchedKeywords,
  };
}

async function assessCrisisSeverityWithAI(
  message: string
): Promise<"NONE" | "LOW" | "MEDIUM" | "HIGH"> {
  try {
    const response = await bedrockClient.send(
      new ConverseCommand({
        modelId: MODEL_ID,
        messages: [
          {
            role: "user",
            content: [{ text: CRISIS_ASSESSMENT_PROMPT + message }],
          },
        ],
        inferenceConfig: {
          maxTokens: 10,
          temperature: 0,
        },
      })
    );

    const result =
      response.output?.message?.content?.[0]?.text?.trim().toUpperCase() || "NONE";

    // Validate the response is one of the expected values
    if (["HIGH", "MEDIUM", "LOW", "NONE"].includes(result)) {
      return result as "NONE" | "LOW" | "MEDIUM" | "HIGH";
    }

    return "NONE";
  } catch (error) {
    console.error("Error in AI crisis assessment:", error);
    // Default to NONE if the AI assessment fails — keyword scan already passed
    return "NONE";
  }
}

async function detectCrisis(message: string): Promise<CrisisResult> {
  // Step 1: Keyword scan
  const scan = keywordScan(message);

  if (scan.matched) {
    // Keywords found — immediate HIGH severity, no need for AI assessment
    return {
      detected: true,
      severity: "HIGH",
      keywords: scan.keywords,
      aiAssessed: false,
    };
  }

  // Step 2: No keywords matched — run AI severity assessment
  const aiSeverity = await assessCrisisSeverityWithAI(message);

  const detected = aiSeverity === "HIGH" || aiSeverity === "MEDIUM";

  return {
    detected,
    severity: aiSeverity,
    keywords: [],
    aiAssessed: true,
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
  crisisResult: CrisisResult
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
        keywords: crisisResult.keywords,
        severity: crisisResult.severity,
        aiAssessed: crisisResult.aiAssessed,
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

    // Step 1 & 2: Run crisis detection (keyword scan + AI assessment if needed)
    const crisisResult = await detectCrisis(data.message);

    // Step 3: Load conversation history from DynamoDB (last 20 messages)
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

    // Build system prompt — add crisis-aware addition if crisis detected
    let systemPrompt = SYSTEM_PROMPT;
    if (crisisResult.detected) {
      systemPrompt += `\n\nCRISIS ALERT: The mother's message has been flagged as potentially indicating a crisis (severity: ${crisisResult.severity}). Please respond with extra care, validate her feelings, provide emergency contacts, and strongly encourage her to reach out to a professional immediately. Do not minimize her experience.`;
    }

    // Step 4: Call Amazon Bedrock Nova Pro using the Converse API
    const converseResponse = await bedrockClient.send(
      new ConverseCommand({
        modelId: MODEL_ID,
        system: [{ text: systemPrompt }],
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

    // Step 5: Store the user message in DynamoDB
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

    // Step 6: If crisis detected, write to crisis events table
    if (crisisResult.detected) {
      await storeCrisisEvent(
        data.userId,
        data.sessionId,
        data.message,
        crisisResult
      );
    }

    // Step 7: Return response with crisisDetected flag and severity
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        response: aiResponseText,
        crisisDetected: crisisResult.detected,
        severity: crisisResult.severity,
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
