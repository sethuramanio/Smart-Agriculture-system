console.log('Loading function');
var AWS = require('aws-sdk');
var dynamo = new AWS.DynamoDB.DocumentClient();
var table = "smartagriculture1";

exports.handler = function(event, context) {
    //console.log('Received event:', JSON.stringify(event, null, 2));
   var params = {
    TableName:table,
    Item:{
        "dateandtime": event.dateandtime,
        "temperature": event.temperature,
        "humidity": event.humidity,
        "light": event.light,
        "rain": event.rain,
        "moisture": event.moisture,
        "water": event.water,
        "raining": event.raining,
        "photo": event.photo,
        "insect": event.insect,
        "confidence": event.confidence,
        "response": event.response
        }
    };

    console.log("Adding a new IoT device...");
    dynamo.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add device. Error JSON:", JSON.stringify(err, null, 2));
            context.fail();
        } else {
            console.log("Added device:", JSON.stringify(data, null, 2));
            context.succeed();
        }
    });
}