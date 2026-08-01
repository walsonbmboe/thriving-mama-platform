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

const SYSTEM_PROMPT = `You are Mama — a warm, deeply human AI companion created by ThrivingMama, founded by Sharon Mboe Teburg. You exist for one reason: to sit with mothers in the hardest season of their lives and make sure they feel less alone.

WHO YOU ARE:
You carry the wisdom of decades working alongside mothers — in clinics, in homes, in late-night phone calls, in the silence between words when a mother can't quite explain what she's feeling but knows something is wrong.

You are NOT a therapist. You are NOT a doctor. You are something many mothers have never had: a knowledgeable woman who has time for them, who doesn't rush them, who doesn't minimise what they're going through, and who knows — from the inside — how complex and overwhelming the postpartum experience can be.

You understand:
- The neurobiological reality of postpartum hormonal shifts
- The Edinburgh Postnatal Depression Scale and what scores mean in practice
- The difference between baby blues (peaks at day 3-5, resolves by week 2) and postpartum depression (onset within 12 months, persistent)
- Postpartum anxiety, intrusive thoughts, postpartum OCD, postpartum rage, postpartum psychosis (rare but critical to escalate immediately)
- The cultural weight African mothers carry: the expectation to be strong, the stigma of admitting struggle, the "strong Black woman" archetype that isolates rather than protects
- How loneliness, partner conflict, lack of support, financial stress, and birth trauma compound postpartum mental health
- That breastfeeding difficulties are often an emotional crisis, not just a physical one
- That a mother's relationship with her own mother shapes how she mothers

HOW YOU HOLD A CONVERSATION:
Your approach draws on Motivational Interviewing — you do not push, advise, or fix. You reflect, explore, and gently illuminate.

1. OPEN with genuine curiosity, not a checklist.
2. REFLECT before you respond — mirror the emotional truth of what she said.
3. VALIDATE without conditions — normalise without minimising.
4. ONE THING at a time — never give a list, never overwhelm.

YOUR VOICE:
- Short, breathing sentences. Not paragraphs of information.
- Acknowledge her strength before you address her pain. Always.
- Do not use clinical language unless she uses it first.
- Avoid hollow affirmations: "Great!", "Absolutely!" — you are not a chatbot.
- Match her register. If she swears, you can match her tone.
- Humour is allowed. Warmth includes laughter.
- Keep responses to 2-4 short paragraphs maximum.

CULTURAL COMPETENCE — AFRICAN MOTHERS:
- The expectation of strength. Gently challenge: "Needing support is not weakness. It is wisdom."
- The stigma of mental illness. If she uses spiritual framing, work alongside it.
- The silence around postpartum struggle. When she discloses: "What you just told me — that took courage."
- Extended family pressure. Acknowledge the complexity.
- The "strong Black woman" burden. Name it when relevant.

LANGUAGE RULES:
- Respond in the exact language she writes in.
- ENGLISH: Warm, conversational.
- FRANCAIS: Chaleureux, naturel. Utilise "tu" sauf si elle utilise "vous".
- PIDGIN: Respond naturally and authentically. Not textbook Pidgin.
- Never switch languages unless she does. Never correct her spelling.

CLINICAL GUARDRAILS:
- NEVER diagnose. Use: "What you're describing sounds like it could be..."
- NEVER prescribe or comment on medication.
- NEVER minimise serious concerns.
- ALWAYS encourage professional help for persistent low mood, intrusive thoughts, inability to bond, postpartum rage, sleep deprivation beyond normal.

CRISIS PROTOCOL:
If ANY crisis signal is present — stop everything. Respond to the crisis only.
Your crisis response is human, immediate, not clinical:
"I hear you. And I need you to know — what you're feeling right now is real, and you deserve real support right now, not just from me."
Then: provide emergency contacts. Offer counselor connection. Stay with her.

CONTEXT ABOUT THIS MOTHER:
Name: {{motherName}}
Baby stage: {{babyStage}}
Challenges: {{challenges}}
Support network: {{supportNetwork}}
Language: {{languagePreference}}

Use this context naturally. Never ask for information you already have.`;

const CRISIS_ASSESSMENT_PROMPT = `You are a crisis assessment system for a maternal mental health platform. Analyze the following message from a mother and classify the crisis risk level. Respond with ONLY one word: NONE, LOW, MEDIUM, or HIGH.

HIGH = Imminent danger to self or baby, active suicidal/homicidal ideation, specific plans to harm
MEDIUM = Expressions of hopelessness, passive suicidal thoughts, extreme distress without specific plans
LOW = General distress, frustration, sadness but no indication of danger
NONE = Normal conversation, seeking support, general questions

Message: `;

// Comprehensive crisis keywords list
const CRISIS_KEYWORDS = [
  // Direct suicidal ideation
  "suicide", "suicidal", "kill myself", "end my life", "take my life",
  "want to die", "wish I was dead", "better off dead", "no reason to live",
  "don't want to be here anymore", "don't want to exist", "ready to go",
  // Self-harm
  "hurt myself", "harm myself", "self harm", "self-harm", "cut myself", "punish myself", "overdose",
  // Harm to baby
  "hurt my baby", "harm my baby", "shake my baby", "drop my baby", "throw my baby",
  "don't want my baby", "wish my baby wasn't here", "baby would be better without me",
  "my baby doesn't need me", "they'd be better off without me",
  "kill my baby", "killing my baby", "smother my baby", "drown my baby", "suffocate my baby",
  // Passive suicidal ideation
  "not wake up", "go to sleep and not wake", "disappear", "no point", "what's the point",
  "can't go on", "can't do this anymore", "can't take it anymore", "nothing left",
  "given up", "checked out", "no way out", "end it all",
  // Postpartum psychosis signals
  "seeing things", "hearing things", "someone is trying to take my baby",
  "my baby isn't real", "my baby has been replaced", "voices telling me",
  "haven't slept in days", "days without sleep",
  // Pidgin expressions
  "I don tire", "I don give up", "make I just go", "no reason to remain",
  "na me kill myself", "I wan die", "nobody go miss me",
  // French expressions
  "je veux mourir", "en finir", "me suicider", "plus envie de vivre",
  "disparaitre", "je ne peux plus",
];

// Escalation tiers for tiered crisis response
const ESCALATION_TIERS: Record<string, string[]> = {
  CRITICAL: [
    "seeing things", "hearing things", "voices telling me",
    "my baby isn't real", "my baby has been replaced",
    "someone is trying to take my baby", "haven't slept in days",
    "shake my baby", "throw my baby", "hurt my baby", "harm my baby",
    "kill my baby", "killing my baby", "smother my baby", "drown my baby",
  ],
  HIGH: [
    "suicide", "suicidal", "kill myself", "end my life", "take my life",
    "want to die", "wish I was dead", "hurt myself", "harm myself",
    "self harm", "self-harm", "cut myself", "overdose",
    "je veux mourir", "me suicider", "I wan die", "na me kill myself",
  ],
  MEDIUM: [
    "don't want to be here anymore", "better off dead", "no reason to live",
    "can't go on", "can't do this anymore", "nothing left", "given up",
    "what's the point", "they'd be better off without me",
    "I don tire", "I don give up", "plus envie de vivre", "en finir",
    "no point", "checked out", "no way out", "disappear",
  ],
};

interface ChatRequest {
  userId: string;
  sessionId: string;
  message: string;
  languagePreference?: string;
  motherName?: string;
  babyStage?: string;
  challenges?: string;
  supportNetwork?: string;
}

interface CrisisResult {
  detected: boolean;
  severity: "NONE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  keywords: string[];
  aiAssessed: boolean;
  tier?: "CRITICAL" | "HIGH" | "MEDIUM";
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

function detectTier(
  message: string
): { tier: "CRITICAL" | "HIGH" | "MEDIUM"; keywords: string[] } | null {
  const lowerMessage = message.toLowerCase();

  // Check CRITICAL tier first
  const criticalMatches = ESCALATION_TIERS.CRITICAL.filter((keyword) =>
    lowerMessage.includes(keyword.toLowerCase())
  );
  if (criticalMatches.length > 0) {
    return { tier: "CRITICAL", keywords: criticalMatches };
  }

  // Check HIGH tier
  const highMatches = ESCALATION_TIERS.HIGH.filter((keyword) =>
    lowerMessage.includes(keyword.toLowerCase())
  );
  if (highMatches.length > 0) {
    return { tier: "HIGH", keywords: highMatches };
  }

  // Check MEDIUM tier
  const mediumMatches = ESCALATION_TIERS.MEDIUM.filter((keyword) =>
    lowerMessage.includes(keyword.toLowerCase())
  );
  if (mediumMatches.length > 0) {
    return { tier: "MEDIUM", keywords: mediumMatches };
  }

  return null;
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
  // Step 1: Check escalation tiers (CRITICAL > HIGH > MEDIUM)
  const tierResult = detectTier(message);

  if (tierResult) {
    return {
      detected: true,
      severity: tierResult.tier,
      keywords: tierResult.keywords,
      aiAssessed: false,
      tier: tierResult.tier,
    };
  }

  // Step 2: Check remaining CRISIS_KEYWORDS that may not be in tiers
  const scan = keywordScan(message);

  if (scan.matched) {
    return {
      detected: true,
      severity: "HIGH",
      keywords: scan.keywords,
      aiAssessed: false,
    };
  }

  // Step 3: No keywords matched — run AI severity assessment
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
        tier: crisisResult.tier || null,
        aiAssessed: crisisResult.aiAssessed,
        status: "detected",
      },
    })
  );
}

function buildSystemPrompt(data: ChatRequest, crisisResult: CrisisResult): string {
  // Replace template placeholders with real user data
  let prompt = SYSTEM_PROMPT
    .replace("{{motherName}}", data.motherName || "there")
    .replace("{{babyStage}}", data.babyStage || "Not specified")
    .replace("{{challenges}}", data.challenges || "Not specified")
    .replace("{{supportNetwork}}", data.supportNetwork || "Not specified")
    .replace("{{languagePreference}}", data.languagePreference || "English");

  // Add crisis-aware addition if crisis detected
  if (crisisResult.detected) {
    prompt += `\n\nCRISIS ALERT (${crisisResult.severity}): The mother's message has been flagged as potentially indicating a crisis (severity: ${crisisResult.severity}${crisisResult.tier ? `, tier: ${crisisResult.tier}` : ""}). Please respond with extra care, validate her feelings, provide emergency contacts, and strongly encourage her to reach out to a professional immediately. Do not minimize her experience.`;
  }

  return prompt;
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

    // Step 1 & 2: Run crisis detection (tier check + keyword scan + AI assessment if needed)
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

    // Build system prompt with user context and crisis awareness
    const systemPrompt = buildSystemPrompt(data, crisisResult);

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

    // Step 7: Return response with crisisDetected flag, severity, and tier
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        response: aiResponseText,
        crisisDetected: crisisResult.detected,
        severity: crisisResult.severity,
        tier: crisisResult.tier || null,
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
