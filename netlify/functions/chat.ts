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
import { buildSystemPrompt } from "../../src/lib/ai/system-prompt-v2";
import { evaluateCrisis, CrisisEvaluation } from "../../src/lib/ai/crisis-detector";

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

const CRISIS_ASSESSMENT_PROMPT = `You are a crisis assessment system for a maternal mental health platform. Analyze the following message from a mother and classify the crisis risk level. Respond with ONLY one word: NONE, LOW, MEDIUM, or HIGH.

HIGH = Imminent danger to self or baby, active suicidal/homicidal ideation, specific plans to harm
MEDIUM = Expressions of hopelessness, passive suicidal thoughts, extreme distress without specific plans
LOW = General distress, frustration, sadness but no indication of danger
NONE = Normal conversation, seeking support, general questions

Message: `;

interface ChatRequest {
  userId: string;
  sessionId: string;
  message: string;
  motherName?: string;
  babyStage?: string;
  challenges?: string;
  supportNetwork?: string;
  languagePreference?: string;
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
  crisis: CrisisEvaluation
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
        tier: crisis.tier,
        confidence: crisis.confidence,
        matchedSignals: crisis.matchedSignals,
        reasoning: crisis.reasoning,
        status: "detected",
      },
    })
  );
}

async function runAICrisisAssessment(
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

    if (["HIGH", "MEDIUM", "LOW", "NONE"].includes(result)) {
      return result as "NONE" | "LOW" | "MEDIUM" | "HIGH";
    }

    return "NONE";
  } catch (error) {
    console.error("Error in AI crisis assessment:", error);
    return "NONE";
  }
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

    // Step 1: Load conversation history from DynamoDB (last 20 messages)
    const history = await getConversationHistory(data.sessionId);

    // Get recent messages as strings for crisis detector context
    const recentMessages = history
      .filter((msg) => msg.role === "user")
      .map((msg) => msg.content as string);

    // Step 2: Run keyword-based crisis evaluation
    let crisis = evaluateCrisis(data.message, recentMessages);

    // Step 3: If keyword detector returns NONE, run AI fallback to catch subtle cases
    let aiAssessment: string | null = null;
    if (crisis.tier === 'NONE') {
      const aiResult = await runAICrisisAssessment(data.message);
      aiAssessment = aiResult;

      // If AI detects something the keywords missed, upgrade the tier
      if (aiResult === 'HIGH') {
        crisis = {
          ...crisis,
          tier: 'HIGH',
          confidence: 0.7,
          reasoning: 'AI assessment detected high risk not caught by keyword scan',
          shouldEscalate: true,
          shouldShowHotlines: true,
          shouldDeepenConversation: false,
        };
      } else if (aiResult === 'MEDIUM') {
        crisis = {
          ...crisis,
          tier: 'MEDIUM',
          confidence: 0.5,
          reasoning: 'AI assessment detected medium risk not caught by keyword scan',
          shouldEscalate: false,
          shouldShowHotlines: false,
          shouldDeepenConversation: true,
        };
      }
    }

    // Step 4: Build system prompt with mother context and crisis tier
    const systemPrompt = buildSystemPrompt({
      name: data.motherName,
      babyStage: data.babyStage,
      challenges: data.challenges?.split(',').map(c => c.trim()),
      supportNetwork: data.supportNetwork,
      language: data.languagePreference as 'en' | 'fr' | 'pcm' | undefined,
      crisisTier: crisis.tier,
      sessionCount: history.filter((msg) => msg.role === "user").length,
    });

    // Step 5: Build messages array for Bedrock Converse API
    const messages = history.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: [{ text: msg.content as string }],
    }));

    // Add the current user message
    messages.push({
      role: "user" as const,
      content: [{ text: data.message }],
    });

    // Step 6: Call Amazon Bedrock Nova Pro using the Converse API
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

    // Step 7: Store the user message in DynamoDB
    await storeMessage(
      data.sessionId,
      data.userId,
      "user",
      data.message,
      crisis.shouldShowHotlines
    );

    // Store the AI response in DynamoDB
    await storeMessage(
      data.sessionId,
      data.userId,
      "assistant",
      aiResponseText
    );

    // Step 8: Store crisis event for HIGH and CRITICAL only
    if (crisis.tier === 'HIGH' || crisis.tier === 'CRITICAL') {
      await storeCrisisEvent(
        data.userId,
        data.sessionId,
        data.message,
        crisis
      );
    }

    // Step 9: Return response
    // Only set crisisDetected: true when hotlines should be shown (HIGH or CRITICAL)
    // MONITOR and MEDIUM are handled silently via the system prompt
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        response: aiResponseText,
        crisisDetected: crisis.shouldShowHotlines,
        tier: crisis.tier,
        shouldDeepenConversation: crisis.shouldDeepenConversation,
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
