require('dotenv').config()
const axios = require('axios').default;

let url = `https://discord.com/api/v8/applications/${process.env.APP_ID}/commands` //url to register global command

//required headers for the discord post request
const headers = {
    "Authorization": `Bot ${process.env.BOT_TOKEN}`,
    "Content-Type": "application/json"
}
//data to register a new command
let command_data = {
    "name": "ask",
    "type": 1,
    "description": "question to ask",
    "options":[{
        "name": "question",
        "description": "question to ask",
        "type":3, //specify text input to be received from user
        "required": true
    }]
}

//post request to register the command
try{
    axios.post(url, JSON.stringify(command_data), {
        headers: headers,
    });
}catch(e){
    console.log(e);
}



