/**
 * implement with aws api gateway
 * involeUrl: https://v69x1qvvyj.execute-api.us-west-1.amazonaws.com/dev/booking
 * method: GET
 * lambda will only return items with "bookingId"
 */
// Include the AWS SDK module
const AWS = require('aws-sdk');

// Instantiate a DynamoDB document client with the SDK
let dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    // Use built-in module to get current date & time
    let date = new Date();
    // Store date and time in human-readable format in a variable
    let now = date.toISOString();
    // Define handler function, the entry point to our code for the Lambda service
    // We receive the object that triggers the function as a parameter
    
    let params = {
        TableName:'strikers',
        FilterExpression: "contains(#Id, :id)",
        ExpressionAttributeNames: {
            "#Id": "bookingId",
        },
        ExpressionAttributeValues: {
            ":id": "booking_",
        }       

    };
    // Using await, make sure object writes to DynamoDB table before continuing execution
    const res = await dynamodb.scan(params).promise();
    // Create a JSON object with our response and store it in a constant
    const response = {
        statusCode: 200,
        body: res
    };
    // Return the response constant
    return response;
};

function validateFieldsNotPass(event) {
    if (event.username) {
        return false;
    }
    return true;
}
