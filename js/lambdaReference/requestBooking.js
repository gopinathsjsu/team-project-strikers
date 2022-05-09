/**
 * implement with aws api gateway
 * involeUrl: https://v69x1qvvyj.execute-api.us-west-1.amazonaws.com/dev/booking
 * method: POST
 * requred json to pass through {event}
 * {
 *  username: xx ;  //required fieild for event
 *  hotelId : xx;   //required fieild for event if hotelId not there, hotel is required
 *  checkin_date: yyyy-mm-dd;   //required fieild for event
 *  checkout_date: yyyy-mm-dd; //required fieild for event
 *  options : some options;     //required fieild for event
 * }
 */
// Include the AWS SDK module
const AWS = require('aws-sdk');

// Instantiate a DynamoDB document client with the SDK
let dynamodb = new AWS.DynamoDB.DocumentClient();
let testCity1 = require('./testCity1');

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
    let hotelId = event.hotelId;     //required fieild for event if hotelId not there, hotel is required
    let checkin_date = event.checkin_date;   //required fieild for event
    let checkout_date = event.checkout_date; //required fieild for event
    let options = event.options;     //required fieild for event
    
    
    var hotel;
    if(hotelId) {
        hotel = await findTestHotel(hotelId);
    }
    else if(event.hotel) {
        hotel = event.hotel; // if hotelId not there, hotel as json is required
    }
    else {
        return {
        statusCode: 401,
        body: "missing hotel"
        };
    }

    // Create JSON object with parameters for DynamoDB and store in a variable
    let id = 'booking_' + date.getTime();
    // const roomID = 'room_' + date.getTime();
    
    let params = {
        TableName:'strikers',
        Item: {
            'strikersId': id,
            'username': username,
            'hotel' : hotel,
            'bookingId' : id,
            'checkin_date' : checkin_date,
            'checkout_date' : checkout_date,
            'options' : options,
            'RequestTime': now,
        }
    };
    // Using await, make sure object writes to DynamoDB table before continuing execution
    await dynamodb.put(params).promise();
    // Create a JSON object with our response and store it in a constant
    const response = {
        statusCode: 200,
        body: params
    };
    // Return the response constant
    return response;
};

function validateFieldsNotPass(event) {
    if (event.username && event.checkin_date && event.checkout_date && event.options) {
        return false;
    }
    return true;
}

function findTestHotel(id) {
    if(id=="testId") {
        id = Math.floor(Math.random() * testCity1.hotels.length);
        if(testCity1.hotels[id].hasOwnProperty('hotelId')) {
            return testCity1.hotels[id];
        }
    } else {
        for(var i = 0; i < testCity1.hotels.length; i++) {
            if(testCity1.hotels[i].hasOwnProperty('hotelId')) {
                if(testCity1.hotels[i]['hotelId'] == id) {
                    return testCity1.hotels[i];
                }
            }
        }
    }
    return testCity1.hotels[0];
}