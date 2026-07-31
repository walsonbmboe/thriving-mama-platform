import { Amplify } from "aws-amplify";

export const authConfig = {
 region: "us-east-1",
 userPoolId: "us-east-1_QPQOjssCW",
 userPoolClientId: "33andt3p1d0qscjkh6n78iu0t7",
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
