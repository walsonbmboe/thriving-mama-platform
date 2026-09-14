import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
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

const EPDS_RESULTS_TABLE = "thriving-mama-epds-results";
const CRISIS_EVENTS_TABLE = "thriving-mama-crisis-events";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Content-Type": "application/json",
};

// Number of questions in the Edinburgh Postnatal Depression Scale.
const EPDS_QUESTION_COUNT = 10;
// Index of the self-harm question ("thought of harming myself").
const SELF_HARM_INDEX = 9;
// A total score at or above this value recommends booking a counselor.
const RECOMMEND_BOOKING_THRESHOLD = 10;
// A total score at or above this value is considered high risk.
const HIGH_RISK_THRESHOLD = 13;

type RiskLevel = "low" | "moderate" | "high";

interface EpdsSubmitRequest {
  userId: string;
  answers: number[];
}

interface EpdsResultItem {
  userId: string;
  timestamp: string;
  score: number;
  answers: number[];
  riskLevel: RiskLevel;
  selfHarmScore: number;
  createdAt: string;
}

interface CrisisEventItem {
  eventId: string;
  userId: string;
  timestamp: string;
  source: string;
  score: number;
  selfHarmScore: number;
  severity: "HIGH" | "MEDIUM";
  reasoning: string;
  status: string;
}

/**
 * Validate that answers is an array of exactly EPDS_QUESTION_COUNT integers,
 * each between 0 and 3 (inclusive).
 */
function isValidAnswers(answers: unknown): answers is number[] {
  if (!Array.isArray(answers) || answers.length !== EPDS_QUESTION_COUNT) {
    return false;
  }
  return answers.every(
    (a) =>
      typeof a === "number" &&
      Number.isInteger(a) &&
      a >= 0 &&
      a <= 3
  );
}

function determineRiskLevel(score: number): RiskLevel {
  if (score >= HIGH_RISK_THRESHOLD) {
    return "high";
  }
  if (score >= RECOMMEND_BOOKING_THRESHOLD) {
    return "moderate";
  }
  return "low";
}

async function handlePost(event: HandlerEvent) {
  if (!event.body) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Request body is required" }),
    };
  }

  const data: EpdsSubmitRequest = JSON.parse(event.body);

  // Validate userId
  if (!data.userId) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Missing required field: userId" }),
    };
  }

  // Validate answers array
  if (!isValidAnswers(data.answers)) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error:
          "Invalid answers: must be an array of exactly 10 integers, each between 0 and 3",
      }),
    };
  }

  const answers = data.answers;
  const totalScore = answers.reduce((sum, val) => sum + val, 0);
  const selfHarmScore = answers[SELF_HARM_INDEX];
  const riskLevel = determineRiskLevel(totalScore);
  const selfHarmFlagged = selfHarmScore >= 1;

  // Flags
  const recommendBooking = totalScore >= RECOMMEND_BOOKING_THRESHOLD;
  // ANY self-harm response escalates regardless of total score.
  const crisisEscalation =
    totalScore >= HIGH_RISK_THRESHOLD || selfHarmFlagged;

  const now = new Date().toISOString();

  const item: EpdsResultItem = {
    userId: data.userId,
    timestamp: now,
    score: totalScore,
    answers,
    riskLevel,
    selfHarmScore,
    createdAt: now,
  };

  // Store the screening result.
  await docClient.send(
    new PutCommand({
      TableName: EPDS_RESULTS_TABLE,
      Item: item,
    })
  );

  // On crisis escalation, also record a crisis event for follow-up.
  if (crisisEscalation) {
    const severity: "HIGH" | "MEDIUM" =
      selfHarmFlagged || totalScore >= HIGH_RISK_THRESHOLD ? "HIGH" : "MEDIUM";

    const reasoning = selfHarmFlagged
      ? `Self-harm question answered with score ${selfHarmScore}; total EPDS score ${totalScore}.`
      : `EPDS total score ${totalScore} at or above high-risk threshold of ${HIGH_RISK_THRESHOLD}.`;

    const crisisEvent: CrisisEventItem = {
      eventId: uuidv4(),
      userId: data.userId,
      timestamp: now,
      source: "epds",
      score: totalScore,
      selfHarmScore,
      severity,
      reasoning,
      status: "detected",
    };

    await docClient.send(
      new PutCommand({
        TableName: CRISIS_EVENTS_TABLE,
        Item: crisisEvent,
      })
    );
  }

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      success: true,
      score: totalScore,
      riskLevel,
      recommendBooking,
      crisisEscalation,
      selfHarmFlagged,
    }),
  };
}

async function handleGet(event: HandlerEvent) {
  const params = event.queryStringParameters || {};
  const userId = params.userId;

  if (!userId) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Missing required query param: userId" }),
    };
  }

  // Newest-first ordering (ScanIndexForward false). "timestamp" is a
  // DynamoDB reserved word, so alias it with an expression attribute name.
  const result = await docClient.send(
    new QueryCommand({
      TableName: EPDS_RESULTS_TABLE,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeNames: {
        "#ts": "timestamp",
      },
      ExpressionAttributeValues: {
        ":userId": userId,
      },
      ProjectionExpression:
        "userId, #ts, score, answers, riskLevel, selfHarmScore, createdAt",
      ScanIndexForward: false,
    })
  );

  const results = (result.Items || []) as EpdsResultItem[];

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({ results }),
  };
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

  try {
    if (event.httpMethod === "POST") {
      return await handlePost(event);
    }

    if (event.httpMethod === "GET") {
      return await handleGet(event);
    }

    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  } catch (error) {
    console.error("Error processing EPDS request:", error);

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
