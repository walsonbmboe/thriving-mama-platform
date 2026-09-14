"""Generate the ThrivingMama mood tracker Netlify Function.

Writes netlify/functions/mood.ts using pathlib. This keeps the TypeScript
source under version control while letting us regenerate it deterministically.
"""

from pathlib import Path

MOOD_FUNCTION_TS = '''\
import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

const awsCredentials = {
  accessKeyId: process.env.TM_AWS_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.TM_AWS_SECRET_ACCESS_KEY || "",
};

const client = new DynamoDBClient({
  region: process.env.TM_AWS_REGION || "us-east-1",
  credentials: awsCredentials,
});
const docClient = DynamoDBDocumentClient.from(client);

const MOOD_CHECKINS_TABLE = "thriving-mama-mood-checkins";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Content-Type": "application/json",
};

// Number of most recent consecutive low-mood entries required to flag a trend.
const CONSECUTIVE_LOW_MOOD_THRESHOLD = 3;
// A rating at or below this value is considered "low mood".
const LOW_MOOD_RATING = 2;
// Lookback window (in days) used to evaluate the consecutive low-mood trend.
const LOW_MOOD_LOOKBACK_DAYS = 3;
// Default history range (in days) for GET requests.
const DEFAULT_HISTORY_DAYS = 30;

interface MoodCheckinRequest {
  userId: string;
  rating: number;
  note?: string;
  tags?: string[];
}

interface MoodCheckinItem {
  userId: string;
  timestamp: string;
  rating: number;
  note: string | null;
  tags: string[];
  createdAt: string;
}

/**
 * Query a user's mood check-ins from a given ISO cutoff up to now.
 * Results are returned newest-first when scanForward is false.
 */
async function queryCheckinsSince(
  userId: string,
  sinceIso: string,
  scanForward: boolean
): Promise<MoodCheckinItem[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: MOOD_CHECKINS_TABLE,
      KeyConditionExpression: "userId = :userId AND #ts >= :since",
      ExpressionAttributeNames: {
        "#ts": "timestamp",
      },
      ExpressionAttributeValues: {
        ":userId": userId,
        ":since": sinceIso,
      },
      ScanIndexForward: scanForward,
    })
  );

  return (result.Items || []) as MoodCheckinItem[];
}

/**
 * Detect a consecutive low-mood trend.
 *
 * `recent` must be ordered newest-first. We inspect the most recent
 * CONSECUTIVE_LOW_MOOD_THRESHOLD entries and flag the trend only when
 * every one of them has a rating <= LOW_MOOD_RATING.
 */
function hasConsecutiveLowMood(recent: MoodCheckinItem[]): boolean {
  if (recent.length < CONSECUTIVE_LOW_MOOD_THRESHOLD) {
    return false;
  }

  const mostRecent = recent.slice(0, CONSECUTIVE_LOW_MOOD_THRESHOLD);
  return mostRecent.every((entry) => entry.rating <= LOW_MOOD_RATING);
}

async function handlePost(event: HandlerEvent) {
  if (!event.body) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Request body is required" }),
    };
  }

  const data: MoodCheckinRequest = JSON.parse(event.body);

  // Validate userId
  if (!data.userId) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Missing required field: userId" }),
    };
  }

  // Validate rating is present and within 1-5
  if (
    typeof data.rating !== "number" ||
    !Number.isInteger(data.rating) ||
    data.rating < 1 ||
    data.rating > 5
  ) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: "Invalid rating: must be an integer between 1 and 5",
      }),
    };
  }

  const now = new Date().toISOString();

  const item: MoodCheckinItem = {
    userId: data.userId,
    timestamp: now,
    rating: data.rating,
    note: data.note ?? null,
    tags: data.tags ?? [],
    createdAt: now,
  };

  // Store the check-in
  await docClient.send(
    new PutCommand({
      TableName: MOOD_CHECKINS_TABLE,
      Item: item,
    })
  );

  // Query the last few days of check-ins (newest-first) to detect a
  // consecutive low-mood trend.
  const lookbackCutoff = new Date(
    Date.now() - LOW_MOOD_LOOKBACK_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  const recentCheckins = await queryCheckinsSince(
    data.userId,
    lookbackCutoff,
    false
  );

  const consecutiveLowMood = hasConsecutiveLowMood(recentCheckins);

  const message = consecutiveLowMood
    ? "We've noticed a few low days in a row. You're not alone, and support is available whenever you need it."
    : "Mood check-in saved. Thank you for taking a moment for yourself.";

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      success: true,
      consecutiveLowMood,
      message,
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

  // Parse the optional days range, falling back to the default.
  let days = DEFAULT_HISTORY_DAYS;
  if (params.days) {
    const parsed = parseInt(params.days, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      days = parsed;
    }
  }

  const sinceIso = new Date(
    Date.now() - days * 24 * 60 * 60 * 1000
  ).toISOString();

  // Newest-first ordering (ScanIndexForward false).
  const checkins = await queryCheckinsSince(userId, sinceIso, false);

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({ checkins }),
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
    console.error("Error processing mood check-in:", error);

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
'''


def main() -> None:
    project_root = Path(r"c:\\Users\\mboee\\thriving-mama-project")
    target = project_root / "netlify" / "functions" / "mood.ts"

    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(MOOD_FUNCTION_TS, encoding="utf-8", newline="\n")

    print(f"Wrote {target} ({target.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
