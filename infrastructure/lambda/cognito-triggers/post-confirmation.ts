import {
  PostConfirmationTriggerEvent,
  PostConfirmationTriggerHandler,
} from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-east-1",
});
const dynamoClient = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const USER_POOL_ID = "us-east-1_QPQOjssCW";
const USERS_TABLE = "thriving-mama-users";

const ROLE_TO_GROUP: Record<string, string> = {
  mother: "Mothers",
  counselor: "Counselors",
};

export const handler: PostConfirmationTriggerHandler = async (
  event: PostConfirmationTriggerEvent
) => {
  console.log("Post Confirmation trigger event:", JSON.stringify(event));

  const userId = event.request.userAttributes.sub;
  const email = event.request.userAttributes.email || "";
  const phone = event.request.userAttributes.phone_number || "";
  const name = event.request.userAttributes.name || "";
  const role = event.request.userAttributes["custom:role"] || "mother";

  // Determine the group based on role
  const groupName = ROLE_TO_GROUP[role] || "Mothers";

  try {
    // Add user to the appropriate Cognito group
    const addToGroupCommand = new AdminAddUserToGroupCommand({
      UserPoolId: USER_POOL_ID,
      Username: event.userName,
      GroupName: groupName,
    });

    await cognitoClient.send(addToGroupCommand);
    console.log(`User ${event.userName} added to group ${groupName}`);

    // Create initial record in thriving-mama-users DynamoDB table
    const putCommand = new PutCommand({
      TableName: USERS_TABLE,
      Item: {
        userId: userId,
        email: email,
        phone: phone,
        name: name,
        role: role,
        createdAt: new Date().toISOString(),
        isOnboardingComplete: false,
      },
      ConditionExpression: "attribute_not_exists(userId)",
    });

    await docClient.send(putCommand);
    console.log(`Initial user record created for ${userId}`);
  } catch (error) {
    console.error("Error in post-confirmation trigger:", error);
    // Don't throw - allow user confirmation to proceed even if group assignment fails
  }

  return event;
};
