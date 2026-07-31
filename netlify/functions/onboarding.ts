import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const awsCredentials = {
  accessKeyId: process.env.TM_AWS_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.TM_AWS_SECRET_ACCESS_KEY || "",
};

const client = new DynamoDBClient({
  region: process.env.TM_AWS_REGION || "us-east-1",
  credentials: awsCredentials,
});
const docClient = DynamoDBDocumentClient.from(client);

const USERS_TABLE = "thriving-mama-users";
const ANALYTICS_TABLE = "thriving-mama-analytics-events";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

interface OnboardingRequest {
  userId: string;
  initialWellbeingStatus?: string;
  languagePreference?: string;
  babyStage?: string;
  firstBaby?: boolean;
  challenges?: string[];
  supportNetwork?: string[];
  currentOnboardingStep?: number;
  isOnboardingComplete?: boolean;
}

const REQUIRED_FIELDS = ["userId"];

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

    const data: OnboardingRequest = JSON.parse(event.body);

    // Validate required fields
    for (const field of REQUIRED_FIELDS) {
      if (!data[field as keyof OnboardingRequest]) {
        return {
          statusCode: 400,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: `Missing required field: ${field}` }),
        };
      }
    }

    const now = new Date().toISOString();

    // Write user profile data to thriving-mama-users table
    const updateParams = {
      TableName: USERS_TABLE,
      Key: { userId: data.userId },
      UpdateExpression:
        "SET initialWellbeingStatus = :wellbeing, " +
        "languagePreference = :lang, " +
        "babyStage = :babyStage, " +
        "firstBaby = :firstBaby, " +
        "challenges = :challenges, " +
        "supportNetwork = :supportNetwork, " +
        "isOnboardingComplete = :onboardingComplete, " +
        "currentOnboardingStep = :step, " +
        "updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":wellbeing": data.initialWellbeingStatus || null,
        ":lang": data.languagePreference || "he",
        ":babyStage": data.babyStage || null,
        ":firstBaby": data.firstBaby ?? null,
        ":challenges": data.challenges || [],
        ":supportNetwork": data.supportNetwork || [],
        ":onboardingComplete": data.isOnboardingComplete ?? false,
        ":step": data.currentOnboardingStep ?? 0,
        ":updatedAt": now,
      },
    };

    await docClient.send(new UpdateCommand(updateParams));

    // Write analytics event to thriving-mama-analytics-events table
    const analyticsParams = {
      TableName: ANALYTICS_TABLE,
      Item: {
        eventId: uuidv4(),
        userId: data.userId,
        eventType: "onboarding_updated",
        timestamp: now,
        metadata: {
          currentStep: data.currentOnboardingStep ?? 0,
          isComplete: data.isOnboardingComplete ?? false,
          languagePreference: data.languagePreference || "he",
          babyStage: data.babyStage || null,
        },
      },
    };

    await docClient.send(new PutCommand(analyticsParams));

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: "Onboarding data saved successfully",
        userId: data.userId,
        isOnboardingComplete: data.isOnboardingComplete ?? false,
      }),
    };
  } catch (error) {
    console.error("Error processing onboarding:", error);

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
