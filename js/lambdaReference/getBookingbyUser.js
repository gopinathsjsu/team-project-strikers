/**
 * implement with aws api gateway
 * involeUrl: https://v69x1qvvyj.execute-api.us-west-1.amazonaws.com/dev/booking/byuser
 * method: POST
 * requred json to pass through {event}
 * {
 *  username: xx ;  //required fieild for event
 * }
 * lambda will return all booking items under username
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
    // Extract values from event and format as strings
    
    if(await validateFieldsNotPass(event)) {
        return {
        statusCode: 401,
        body: "missing something"
        };
    }
    let username = event.username;  //required fieild for event
    
    let params = {
        TableName:'strikers', 
        FilterExpression : "username = :user and contains(#Id, :id)",
        ExpressionAttributeNames: {
            "#Id": "bookingId",
        },
        ExpressionAttributeValues: {
            ":id": "booking_",
            ":user": username,
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
