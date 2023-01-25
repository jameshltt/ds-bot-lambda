const nacl = require('tweetnacl');
// const { ask } = require("./ai.js"); //import the "ask" function
const axios = require('axios').default;
const AWS = require('aws-sdk')
const lambda = new AWS.Lambda();

exports.handler = async (event) => {
    // Checking signature (requirement 1.)
    // Your public key can be found on your application in the Developer Portal
    const PUBLIC_KEY = process.env.PUBLIC_KEY;
    const signature = event.headers['x-signature-ed25519']
    const timestamp = event.headers['x-signature-timestamp'];
    const strBody = event.body; // should be string, for successful sign

    const isVerified = nacl.sign.detached.verify(
        Buffer.from(timestamp + strBody),
        Buffer.from(signature, 'hex'),
        Buffer.from(PUBLIC_KEY, 'hex')
    );

    if (!isVerified) {
        return {
            statusCode: 401,
            body: JSON.stringify('invalid request signature'),
        };
    }
    // Replying to ping (requirement 2.)
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
                'type':4,
                'data': {
                    'content': 'bar',
                }
            })
        }
    }
    // let answer = async function(body){
    //     console.log('body: '+JSON.stringify(body));
    //     var question = body.data.options[0].value;
    //     var resp = await ask(question);
    //     return resp;
    // }
    if(body.data.name === 'ask'){
        const lambdaPromise = lambda.invoke({
            FunctionName: 'arn:aws:lambda:af-south-1:982915021976:function:ds-bot-lambda2',
            Payload: JSON.stringify(event),
            InvocationType: 'Event',
        }).promise();
        if (lambdaPromise) {
            console.log('Returning temporary response...');
            return {
                'statusCode':200,
                'body': JSON.stringify({
                    'type':5,
                    'data': {
                        'content': 'Loading...',
                    }
                })
            };
        }
    }

    // if(body.data.name === 'ask'){
    //     return{
    //         'statusCode':200,
    //         'body':JSON.stringify({
    //             'type':4,
    //             'data': {
    //                 'content': JSON.parse(JSON.stringify(await answer(body)))
    //             }
    //         })
    //     }
    // }
    return {
        statusCode: 404  // If no handler implemented for Discord's request
    }
};