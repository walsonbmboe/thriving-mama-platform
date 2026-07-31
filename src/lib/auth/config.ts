import { Amplify } from "aws-amplify";

export const authConfig = {
 region: process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1",
 userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
 userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "",
};

export function configureAuth() {
 Amplify.configure({
 Auth: {
 Cognito: {
 userPoolId: authConfig.userPoolId,
 userPoolClientId: authConfig.userPoolClientId,
 },
 },
 });
}
