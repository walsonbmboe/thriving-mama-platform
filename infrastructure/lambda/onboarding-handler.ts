/**
 * Onboarding Handler - Lambda/Netlify Function
 * Writes onboarding progress and analytics events to DynamoDB
 * 
 * Tables used:
 * - users: Profile data (babyStage, challenges, supportNetwork, etc.)
 * - analytics_events: Onboarding funnel events
 * 
 * This is a placeholder that will be connected to real AWS services
 * when the AWS account is set up.
 */

interface OnboardingEvent {
 userId: string;
 event: string;
 timestamp: string;
 state: {
 currentOnboardingStep: number;
 initialWellbeingStatus: "okay" | "struggling" | "crisis" | null;
 languagePreference: "en" | "fr" | "pcm";
 babyStage: string | null;
 firstBaby: boolean | null;
 challenges: string[];
 supportNetwork: string | null;
 isOnboardingComplete: boolean;
 };
 metadata?: Record<string, unknown>;
}

interface UserProfileUpdate {
 userId: string;
 initialWellbeingStatus?: string;
 languagePreference?: string;
 babyStage?: string;
 firstBaby?: boolean;
 challenges?: string[];
 supportNetwork?: string;
 isOnboardingComplete?: boolean;
 currentOnboardingStep?: number;
 onboardingCompletedAt?: string;
}

// --- DynamoDB Operations (to be implemented with AWS SDK) ---

async function writeAnalyticsEvent(event: OnboardingEvent): Promise<void> {
 // In production:
 // const client = new DynamoDBClient({});
 // const docClient = DynamoDBDocumentClient.from(client);
 // await docClient.send(new PutCommand({
 // TableName: "analytics_events",
 // Item: {
 // eventId: crypto.randomUUID(),
 // userId: event.userId,
 // eventType: event.event,
 // timestamp: event.timestamp,
 // metadata: event.state,
 // },
 // }));
 console.log("[DynamoDB] analytics_events write:", event.event, event.userId);
}

async function updateUserProfile(update: UserProfileUpdate): Promise<void> {
 // In production:
 // const client = new DynamoDBClient({});
 // const docClient = DynamoDBDocumentClient.from(client);
 // await docClient.send(new UpdateCommand({
 // TableName: "users",
 // Key: { userId: update.userId },
 // UpdateExpression: "SET ...",
 // ExpressionAttributeValues: { ... },
 // }));
 console.log("[DynamoDB] users table update:", update.userId, update);
}

async function scheduleNotification(userId: string, message: string, delayHours: number): Promise<void> {
 // In production: write to notifications table with scheduledAt = now + delayHours
 // Or use EventBridge Scheduler for precise timing
 console.log("[Scheduler] Notification for", userId, "in", delayHours, "hours:", message);
}

// --- Main Handler ---

export async function handler(event: { body: string }) {
 try {
 const body: OnboardingEvent = JSON.parse(event.body);
 const { userId, event: eventName, state, timestamp } = body;

 // Write analytics event
 await writeAnalyticsEvent(body);

 // Update user profile based on event type
 switch (eventName) {
 case "onboarding_started":
 await updateUserProfile({ userId, currentOnboardingStep: 0 });
 break;

 case "wellbeing_triage_completed":
 await updateUserProfile({
 userId,
 initialWellbeingStatus: state.initialWellbeingStatus || undefined,
 currentOnboardingStep: 1,
 });
 break;

 case "language_selected":
 await updateUserProfile({
 userId,
 languagePreference: state.languagePreference,
 currentOnboardingStep: 2,
 });
 break;

 case "profile_completed":
 await updateUserProfile({
 userId,
 babyStage: state.babyStage || undefined,
 firstBaby: state.firstBaby ?? undefined,
 challenges: state.challenges,
 supportNetwork: state.supportNetwork || undefined,
 currentOnboardingStep: 3,
 });
 break;

 case "consent_given":
 await updateUserProfile({ userId, currentOnboardingStep: 4 });
 break;

 case "epds_prompted":
 await updateUserProfile({ userId, currentOnboardingStep: 5 });
 break;

 case "onboarding_completed":
 await updateUserProfile({
 userId,
 isOnboardingComplete: true,
 currentOnboardingStep: 6,
 onboardingCompletedAt: timestamp,
 });
 // Schedule 24-hour follow-up notification
 await scheduleNotification(
 userId,
 "Hi \uD83C\uDF38 Just checking in. How are you feeling today?",
 24
 );
 break;
 }

 return {
 statusCode: 200,
 body: JSON.stringify({ success: true }),
 };
 } catch (error) {
 console.error("[Onboarding Handler Error]", error);
 return {
 statusCode: 500,
 body: JSON.stringify({ error: "Internal server error" }),
 };
 }
}
