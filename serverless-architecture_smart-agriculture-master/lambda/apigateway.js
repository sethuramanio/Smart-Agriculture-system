exports.handler = (event, context, callback) => {
    // TODO implement
    // Libraries importing
    console.log("Starting...");

    var AWS = require('aws-sdk');
    
    console.log("AWS SDK Onboarded");
    
    //Connecting to DynamoDb
    console.log("Creating AWS Object");
    var docClient = new AWS.DynamoDB.DocumentClient();
    console.log("Going to connecet DynamoDB");
    var params = {
        TableName:"newsmartagriculture",
        //KeyConditionExpression: "dateandtime = :dateandtime",
        ScanIndexForward: true,
        //ExpressionAttributeValues: {
        //':dateandtime': "dateandtime"
        //}
    };
     
     
    //Scaning the entire connected table   
    docClient.scan(params, function(err, data) {
        if (err) {
            console.log("Error found - No data found");
            callback(err, null);
        } else {
            console.log("Got data");
            console.log(data);
            
            
            callback(null,data);
        }
        
        
    //callback(null,returnresult);
    });
};