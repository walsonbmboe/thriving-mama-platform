/**
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
