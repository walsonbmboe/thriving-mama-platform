const { CognitoIdentityProviderClient, AdminAddUserToGroupCommand } = require("@aws-sdk/client-cognito-identity-provider");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const cognitoClient = new CognitoIdentityProviderClient({ region: "us-east-1" });
const dynamoClient = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const USER_POOL_ID = "us-east-1_QPQOjssCW";
const USERS_TABLE = "thriving-mama-users";

const ROLE_TO_GROUP = {
 mother: "Mothers",
 counselor: "Counselors",
};

exports.handler = async (event) => {
 console.log("Post Confirmation trigger event:", JSON.stringify(event));

 const userId = event.request.userAttributes.sub;
 const email = event.request.userAttributes.email || "";
 const phone = event.request.userAttributes.phone_number || "";
 const name = event.request.userAttributes.name || "";
 const role = event.request.userAttributes["custom:role"] || "mother";

 const groupName = ROLE_TO_GROUP[role] || "Mothers";

 try {
 await cognitoClient.send(new AdminAddUserToGroupCommand({
 UserPoolId: USER_POOL_ID,
 Username: event.userName,
 GroupName: groupName,
 }));
 console.log("User " + event.userName + " added to group " + groupName);

 await docClient.send(new PutCommand({
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
 }));
 console.log("Initial user record created for " + userId);
 } catch (error) {
 console.error("Error in post-confirmation trigger:", error);
 }

 return event;
};
