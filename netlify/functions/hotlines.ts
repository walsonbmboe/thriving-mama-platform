import { Handler, HandlerEvent } from "@netlify/functions";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const awsCredentials = {
  accessKeyId: process.env.TM_AWS_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.TM_AWS_SECRET_ACCESS_KEY || "",
};

const client = new DynamoDBClient({
  region: process.env.TM_AWS_REGION || "us-east-1",
  credentials: awsCredentials,
});
const docClient = DynamoDBDocumentClient.from(client);

const CONFIG_TABLE = "thriving-mama-config";
const FALLBACK_COUNTRY = "XX";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json",
};

type HotlineType = "emergency" | "maternal" | "psychiatric" | "counselor";

interface Hotline {
  name: string;
  number: string | null;
  available: string;
  type: HotlineType;
  language: string[];
  whatsapp: boolean;
  bookingUrl?: string;
  website?: string;
}

interface CountryHotlinesItem {
  configKey: string;
  countryCode: string;
  countryName: string;
  hotlines: Hotline[];
  updatedAt?: string;
}

const DEFAULT_COUNSELOR: Hotline = {
  name: "ThrivingMama Counselor",
  number: null,
  available: "24/7",
  type: "counselor",
  language: ["en"],
  whatsapp: false,
  bookingUrl: "/mother/booking",
};

async function getCountryHotlines(
  countryCode: string
): Promise<CountryHotlinesItem | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: CONFIG_TABLE,
      Key: { configKey: `HOTLINES#${countryCode}` },
    })
  );

  return (result.Item as CountryHotlinesItem | undefined) ?? null;
}

/**
 * Guarantee that the returned hotlines always include a ThrivingMama
 * counselor entry so the mother is never left without an in-app option.
 */
function ensureCounselor(hotlines: Hotline[]): Hotline[] {
  const hasCounselor = hotlines.some((h) => h.type === "counselor");
  return hasCounselor ? hotlines : [...hotlines, DEFAULT_COUNSELOR];
}

const handler: Handler = async (event: HandlerEvent) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: "",
    };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const params = event.queryStringParameters || {};
    const requestedCountry = (params.countryCode || FALLBACK_COUNTRY).trim();

    let item = await getCountryHotlines(requestedCountry);

    // Fall back to the international "XX" config if the requested country
    // has no dedicated entry.
    if (!item && requestedCountry !== FALLBACK_COUNTRY) {
      item = await getCountryHotlines(FALLBACK_COUNTRY);
    }

    if (!item) {
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          countryCode: FALLBACK_COUNTRY,
          countryName: "Other",
          hotlines: ensureCounselor([]),
        }),
      };
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        countryCode: item.countryCode,
        countryName: item.countryName,
        hotlines: ensureCounselor(item.hotlines || []),
      }),
    };
  } catch (error) {
    console.error("Error fetching hotlines:", error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};

export { handler };
