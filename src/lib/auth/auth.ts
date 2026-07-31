import {
 signUp as amplifySignUp,
 confirmSignUp as amplifyConfirmSignUp,
 signIn as amplifySignIn,
 signOut as amplifySignOut,
 getCurrentUser as amplifyGetCurrentUser,
 fetchAuthSession,
} from "aws-amplify/auth";

export type UserRole = "mother" | "counselor" | "admin";

export interface AuthUser {
 userId: string;
 email?: string;
 phone?: string;
 name?: string;
 role: UserRole;
}

/**
 * Register a new user with Cognito
 */
export async function signUp(params: {
 email?: string;
 phone?: string;
 password: string;
 name: string;
 role: UserRole;
 languagePreference: string;
}) {
 const { email, phone, password, name, role, languagePreference } = params;

 const username = email || phone || "";

 const result = await amplifySignUp({
 username,
 password,
 options: {
 userAttributes: {
 name,
 ...(email && { email }),
 ...(phone && { phone_number: phone }),
 "custom:role": role,
 "custom:languagePreference": languagePreference,
 },
 },
 });

 return result;
}

/**
 * Confirm sign-up with verification code (email or SMS)
 */
export async function confirmSignUp(username: string, code: string) {
 const result = await amplifyConfirmSignUp({
 username,
 confirmationCode: code,
 });
 return result;
}

/**
 * Sign in with email/phone and password
 */
export async function signIn(username: string, password: string) {
 const result = await amplifySignIn({
 username,
 password,
 });
 return result;
}

/**
 * Sign out the current user
 */
export async function signOut() {
 await amplifySignOut();
}

/**
 * Get the currently authenticated user with their role
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
 try {
 const user = await amplifyGetCurrentUser();
 const session = await fetchAuthSession();

 // Extract groups from the ID token
 const idToken = session.tokens?.idToken;
 const groups = (idToken?.payload?.["cognito:groups"] as string[]) || [];
 const attributes = idToken?.payload || {};

 // Determine role from Cognito groups
 let role: UserRole = "mother";
 if (groups.includes("Admins")) {
 role = "admin";
 } else if (groups.includes("Counselors")) {
 role = "counselor";
 } else if (groups.includes("Mothers")) {
 role = "mother";
 }

 return {
 userId: user.userId,
 email: attributes.email as string | undefined,
 phone: attributes.phone_number as string | undefined,
 name: attributes.name as string | undefined,
 role,
 };
 } catch {
 return null;
 }
}

/**
 * Get the redirect path based on user role
 */
export function getDashboardPath(role: UserRole): string {
 switch (role) {
 case "admin":
 return "/admin";
 case "counselor":
 return "/counselor";
 case "mother":
 default:
 return "/mother";
 }
}
