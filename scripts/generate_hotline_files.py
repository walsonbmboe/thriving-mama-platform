"""Generate the ThrivingMama country-aware crisis hotline system files.

Writes 4 files with proper UTF-8 encoding using pathlib.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# ---------------------------------------------------------------------------
# FILE 1: src/types/hotlines.ts
# ---------------------------------------------------------------------------
FILE_1 = r'''export type HotlineType = "emergency" | "maternal" | "psychiatric" | "counselor";

export interface Hotline {
  name: string;
  number: string | null;
  available: string;
  type: HotlineType;
  language: string[];
  whatsapp: boolean;
  bookingUrl?: string;
  website?: string;
}

export interface CountryHotlines {
  countryCode: string;
  countryName: string;
  hotlines: Hotline[];
}

export const HOTLINE_TYPE_LABELS: Record<HotlineType, string> = {
  emergency: "Emergency",
  maternal: "Maternal Health",
  psychiatric: "Psychiatric",
  counselor: "ThrivingMama Counselor",
};

export const SUPPORTED_COUNTRIES: { code: string; name: string }[] = [
  { code: "CM", name: "Cameroon" },
  { code: "NG", name: "Nigeria" },
  { code: "GH", name: "Ghana" },
  { code: "ZA", name: "South Africa" },
  { code: "GB", name: "United Kingdom" },
  { code: "FR", name: "France" },
  { code: "XX", name: "Other" },
];
'''

# ---------------------------------------------------------------------------
# FILE 2: infrastructure/scripts/seed-hotlines.ts
# ---------------------------------------------------------------------------
FILE_2 = r'''/**
 * Seed the ThrivingMama config table with country-aware crisis hotlines.
 *
 * The config table uses a single partition key "configKey" (not PK/SK), so
 * each country is stored as a separate item where:
 *   configKey = "HOTLINES#{countryCode}"
 *
 * Run with:
 *   npx tsx infrastructure/scripts/seed-hotlines.ts
 */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const CONFIG_TABLE = "thriving-mama-config";

const client = new DynamoDBClient({
  region: process.env.TM_AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.TM_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.TM_AWS_SECRET_ACCESS_KEY || "",
  },
});
const docClient = DynamoDBDocumentClient.from(client);

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

interface CountryDefinition {
  countryName: string;
  hotlines: Hotline[];
}

const COUNTRIES: Record<string, CountryDefinition> = {
  CM: {
    countryName: "Cameroon",
    hotlines: [
      {
        name: "Cameroon Emergency Line",
        number: "17117",
        available: "24/7",
        type: "emergency",
        language: ["fr", "en"],
        whatsapp: false,
      },
      {
        name: "Hopital Jamot Yaounde",
        number: "+237 222 03 20 20",
        available: "Mon-Fri 8am-5pm",
        type: "psychiatric",
        language: ["fr", "en"],
        whatsapp: false,
      },
      {
        name: "Minds Center Cameroon",
        number: "+237 233 32 26 66",
        available: "Mon-Sat 8am-6pm",
        type: "psychiatric",
        language: ["fr", "en"],
        whatsapp: true,
      },
      {
        name: "ThrivingMama Counselor",
        number: null,
        available: "24/7",
        type: "counselor",
        language: ["fr", "en", "pcm"],
        whatsapp: false,
        bookingUrl: "/mother/booking",
      },
    ],
  },
  NG: {
    countryName: "Nigeria",
    hotlines: [
      {
        name: "Nigeria Emergency Services",
        number: "199",
        available: "24/7",
        type: "emergency",
        language: ["en"],
        whatsapp: false,
      },
      {
        name: "Mentally Aware Nigeria Initiative",
        number: "+234 809 111 6264",
        available: "24/7",
        type: "maternal",
        language: ["en"],
        whatsapp: true,
      },
      {
        name: "Postpartum Support Network Africa",
        number: null,
        available: "24/7",
        type: "maternal",
        language: ["en"],
        whatsapp: false,
        website: "https://psnafrica.org",
      },
      {
        name: "ThrivingMama Counselor",
        number: null,
        available: "24/7",
        type: "counselor",
        language: ["en", "pcm"],
        whatsapp: false,
        bookingUrl: "/mother/booking",
      },
    ],
  },
  GB: {
    countryName: "United Kingdom",
    hotlines: [
      {
        name: "Emergency Services",
        number: "999",
        available: "24/7",
        type: "emergency",
        language: ["en"],
        whatsapp: false,
      },
      {
        name: "Samaritans",
        number: "116 123",
        available: "24/7",
        type: "emergency",
        language: ["en"],
        whatsapp: false,
      },
      {
        name: "PANDAS Foundation",
        number: "0808 1961 776",
        available: "Mon-Sun 11am-10pm",
        type: "maternal",
        language: ["en"],
        whatsapp: false,
      },
      {
        name: "Association for Post Natal Illness",
        number: "0207 386 0868",
        available: "Mon-Fri 10am-2pm",
        type: "maternal",
        language: ["en"],
        whatsapp: false,
      },
      {
        name: "ThrivingMama Counselor",
        number: null,
        available: "24/7",
        type: "counselor",
        language: ["en"],
        whatsapp: false,
        bookingUrl: "/mother/booking",
      },
    ],
  },
  ZA: {
    countryName: "South Africa",
    hotlines: [
      {
        name: "Emergency Services",
        number: "10111",
        available: "24/7",
        type: "emergency",
        language: ["en"],
        whatsapp: false,
      },
      {
        name: "South African Depression & Anxiety Group",
        number: "0800 456 789",
        available: "Mon-Sun 8am-8pm",
        type: "maternal",
        language: ["en"],
        whatsapp: false,
      },
      {
        name: "Perinatal Mental Health Project",
        number: "+27 21 659 5648",
        available: "Mon-Fri 8am-4pm",
        type: "maternal",
        language: ["en"],
        whatsapp: false,
      },
      {
        name: "ThrivingMama Counselor",
        number: null,
        available: "24/7",
        type: "counselor",
        language: ["en"],
        whatsapp: false,
        bookingUrl: "/mother/booking",
      },
    ],
  },
  GH: {
    countryName: "Ghana",
    hotlines: [
      {
        name: "Ghana Emergency Services",
        number: "999",
        available: "24/7",
        type: "emergency",
        language: ["en"],
        whatsapp: false,
      },
      {
        name: "Mental Health Authority Ghana",
        number: "+233 800 111 222",
        available: "Mon-Fri 8am-5pm",
        type: "psychiatric",
        language: ["en"],
        whatsapp: false,
      },
      {
        name: "ThrivingMama Counselor",
        number: null,
        available: "24/7",
        type: "counselor",
        language: ["en"],
        whatsapp: false,
        bookingUrl: "/mother/booking",
      },
    ],
  },
  FR: {
    countryName: "France",
    hotlines: [
      {
        name: "Services d'urgence",
        number: "15",
        available: "24/7",
        type: "emergency",
        language: ["fr"],
        whatsapp: false,
      },
      {
        name: "Numero national de prevention du suicide",
        number: "3114",
        available: "24/7",
        type: "emergency",
        language: ["fr"],
        whatsapp: false,
      },
      {
        name: "ThrivingMama Counselor",
        number: null,
        available: "24/7",
        type: "counselor",
        language: ["fr", "en"],
        whatsapp: false,
        bookingUrl: "/mother/booking",
      },
    ],
  },
  XX: {
    countryName: "Other",
    hotlines: [
      {
        name: "International Emergency",
        number: "112",
        available: "24/7",
        type: "emergency",
        language: ["en", "fr"],
        whatsapp: false,
      },
      {
        name: "African Alliance for Maternal Mental Health",
        number: null,
        available: "Online",
        type: "maternal",
        language: ["en", "fr"],
        whatsapp: false,
        website: "https://www.postpartum.net/get-help/international",
      },
      {
        name: "ThrivingMama Counselor",
        number: null,
        available: "24/7",
        type: "counselor",
        language: ["en", "fr", "pcm"],
        whatsapp: false,
        bookingUrl: "/mother/booking",
      },
    ],
  },
};

async function seed(): Promise<void> {
  const codes = Object.keys(COUNTRIES);
  console.log(`Seeding ${codes.length} country hotline configs into "${CONFIG_TABLE}"...\n`);

  let succeeded = 0;
  let failed = 0;
  const now = new Date().toISOString();

  for (const countryCode of codes) {
    const { countryName, hotlines } = COUNTRIES[countryCode];
    const item = {
      configKey: `HOTLINES#${countryCode}`,
      countryCode,
      countryName,
      hotlines,
      updatedAt: now,
    };

    try {
      await docClient.send(
        new PutCommand({
          TableName: CONFIG_TABLE,
          Item: item,
        })
      );
      succeeded += 1;
      console.log(
        `  [OK] ${countryCode} (${countryName}) - ${hotlines.length} hotlines`
      );
    } catch (error) {
      failed += 1;
      console.error(`  [FAIL] ${countryCode} (${countryName}):`, error);
    }
  }

  console.log("\n----------------------------------------");
  console.log(`Done. ${succeeded} succeeded, ${failed} failed.`);
  console.log("----------------------------------------");

  if (failed > 0) {
    process.exit(1);
  }
}

seed().catch((error) => {
  console.error("Fatal error while seeding hotlines:", error);
  process.exit(1);
});
'''

# ---------------------------------------------------------------------------
# FILE 3: netlify/functions/hotlines.ts
# ---------------------------------------------------------------------------
FILE_3 = r'''import { Handler, HandlerEvent } from "@netlify/functions";
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
'''

# ---------------------------------------------------------------------------
# FILE 4: src/components/crisis/HotlineList.tsx
# ---------------------------------------------------------------------------
FILE_4 = r'''"use client";

import { useEffect, useState } from "react";
import type { Hotline, HotlineType } from "@/types/hotlines";

interface HotlineListProps {
  countryCode?: string;
  introMessage?: string;
}

interface HotlinesResponse {
  countryCode: string;
  countryName: string;
  hotlines: Hotline[];
}

// Ordering weight: emergency first, counselor always last.
const TYPE_ORDER: Record<HotlineType, number> = {
  emergency: 0,
  maternal: 1,
  psychiatric: 2,
  counselor: 3,
};

const TYPE_LABELS: Record<HotlineType, string> = {
  emergency: "Emergency",
  maternal: "Maternal Health",
  psychiatric: "Psychiatric",
  counselor: "ThrivingMama Counselor",
};

function badgeClasses(type: HotlineType): string {
  switch (type) {
    case "emergency":
      // terracotta
      return "bg-[#fde8e6] text-[#db5a47]";
    case "maternal":
      return "bg-primary-100 text-primary-700";
    case "psychiatric":
      return "bg-accent-100 text-accent-700";
    case "counselor":
      return "bg-white/20 text-white";
    default:
      return "bg-warm-gray-100 text-warm-gray-700";
  }
}

function isRenderable(h: Hotline): boolean {
  return Boolean(h.number || h.website || h.bookingUrl);
}

function sortHotlines(hotlines: Hotline[]): Hotline[] {
  return [...hotlines].sort(
    (a, b) => TYPE_ORDER[a.type] - TYPE_ORDER[b.type]
  );
}

function whatsappHref(rawNumber: string): string {
  const cleaned = rawNumber.replace(/[\s+]/g, "");
  return `https://wa.me/${cleaned}`;
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-warm-gray-200 bg-warm-gray-100 p-5"
        >
          <div className="mb-3 h-4 w-2/3 rounded bg-warm-gray-200" />
          <div className="mb-2 h-6 w-1/2 rounded bg-warm-gray-200" />
          <div className="h-3 w-1/3 rounded bg-warm-gray-200" />
        </div>
      ))}
    </div>
  );
}

function HotlineCard({ hotline }: { hotline: Hotline }) {
  const isCounselor = hotline.type === "counselor";
  const isEmergency = hotline.type === "emergency";

  const containerClasses = isCounselor
    ? "sm:col-span-2 rounded-2xl border border-transparent bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white shadow-md"
    : isEmergency
    ? "rounded-2xl border-2 border-[#f5b8b0] bg-red-50 p-5 shadow-sm"
    : "rounded-2xl border border-primary-100 bg-warm-white p-5 shadow-sm";

  const nameClasses = isCounselor
    ? "font-semibold text-white"
    : "font-semibold text-warm-gray-900";

  const numberClasses = isCounselor
    ? "text-lg font-bold text-white"
    : isEmergency
    ? "text-lg font-bold text-[#db5a47]"
    : "text-lg font-bold text-primary-600";

  const availableClasses = isCounselor
    ? "text-sm text-white/80"
    : "text-sm text-warm-gray-500";

  return (
    <div className={containerClasses}>
      <div className="flex items-start justify-between gap-3">
        <p className={nameClasses}>{hotline.name}</p>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClasses(
            hotline.type
          )}`}
        >
          {TYPE_LABELS[hotline.type]}
        </span>
      </div>

      {hotline.number && (
        <a
          href={`tel:${hotline.number}`}
          className={`mt-2 inline-block ${numberClasses}`}
        >
          {hotline.number}
        </a>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-3">
        {hotline.whatsapp && hotline.number && (
          <a
            href={whatsappHref(hotline.number)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-accent-600 hover:text-accent-700"
          >
            WhatsApp
          </a>
        )}

        {hotline.website && (
          <a
            href={hotline.website}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm font-medium ${
              isCounselor
                ? "text-white underline"
                : "text-primary-600 hover:text-primary-700"
            }`}
          >
            Visit website
          </a>
        )}
      </div>

      {hotline.bookingUrl && (
        <a
          href={hotline.bookingUrl}
          className="mt-4 inline-block rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-primary-600 shadow-sm transition-colors hover:bg-warm-gray-50"
        >
          Book a Counselor
        </a>
      )}

      <p className={`mt-3 ${availableClasses}`}>{hotline.available}</p>
    </div>
  );
}

export default function HotlineList({
  countryCode,
  introMessage,
}: HotlineListProps) {
  const [hotlines, setHotlines] = useState<Hotline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const code = countryCode || "XX";

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/.netlify/functions/hotlines?countryCode=${encodeURIComponent(code)}`
        );
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const data: HotlinesResponse = await res.json();
        if (!cancelled) {
          setHotlines(data.hotlines || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            "We couldn't load the support lines right now. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [countryCode]);

  const visible = sortHotlines(hotlines).filter(isRenderable);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h2 className="font-heading text-2xl font-bold text-warm-gray-900">
        You don&apos;t have to face this alone
      </h2>

      {introMessage && (
        <p className="mt-2 text-warm-gray-600 leading-relaxed">
          {introMessage}
        </p>
      )}

      <div className="mt-6">
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <p className="rounded-2xl border border-[#f5b8b0] bg-red-50 p-5 text-[#db5a47]">
            {error}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {visible.map((hotline, index) => (
              <HotlineCard key={`${hotline.name}-${index}`} hotline={hotline} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
'''

FILES = {
    ROOT / "src" / "types" / "hotlines.ts": FILE_1,
    ROOT / "infrastructure" / "scripts" / "seed-hotlines.ts": FILE_2,
    ROOT / "netlify" / "functions" / "hotlines.ts": FILE_3,
    ROOT / "src" / "components" / "crisis" / "HotlineList.tsx": FILE_4,
}


def main() -> None:
    for path, content in FILES.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        print(f"Wrote {path} ({len(content)} chars)")


if __name__ == "__main__":
    main()
