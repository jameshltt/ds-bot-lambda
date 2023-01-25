const nacl = require('tweetnacl');
// const { ask } = require("./ai.js"); //import the "ask" function
const axios = require('axios').default;
const AWS = require('aws-sdk')
//create Lambda client
const lambda = new AWS.Lambda();

exports.handler = async (event) => {
    // Checking signature (requirement 1.)
    // Your public key can be found on your application in the Developer Portal
    const PUBLIC_KEY = process.env.PUBLIC_KEY;
    const signature = event.headers['x-signature-ed25519']
    const timestamp = event.headers['x-signature-timestamp'];
    const strBody = event.body; // should be string, for successful sign
    //If request is valid
    const isVerified = nacl.sign.detached.verify(
        Buffer.from(timestamp + strBody),
        Buffer.from(signature, 'hex'),
        Buffer.from(PUBLIC_KEY, 'hex')
    );
    //If request is not valid
    if (!isVerified) {
        return {
            statusCode: 401,
            body: JSON.stringify('invalid request signature'),
        };
    }
    // Replying to ping (requirement 2.) - test from discord to verify application is active
    const body = JSON.parse(strBody)
    if (body.type == 1) {
        return {
            statusCode: 200,
            body: JSON.stringify({ "type": 1 }),
        }
    }

    // Handle /foo Command
    if (body.data.name === 'foo') {
        return{
            'statusCode':200,
            'body':JSON.stringify({
                'type':4, //Simple response type
                'data': {
                    'content': 'bar',
                }
            })
        }
    }
    //if command recieved is the ask command
    if(body.data.name === 'ask'){
        //invoke 2nd Lambda with the event received from client
        const lambdaPromise = lambda.invoke({
            FunctionName: 'arn:aws:lambda:af-south-1:982915021976:function:ds-bot-lambda2',
            Payload: JSON.stringify(event),
            InvocationType: 'Event',
        }).promise();
        if (await Promise.all([lambdaPromise])) {
            //return a deferred response to client which means that we respond within 3 second timeout
            return {
                'statusCode':200,
                'body': JSON.stringify({
                    'type':5, //type 5 is deferred response
                    'data': {
                        'content': 'Loading...',
                    }
                })
            };
        }
    }
    return {
        statusCode: 404  // If no handler implemented for Discord's request
    }
};