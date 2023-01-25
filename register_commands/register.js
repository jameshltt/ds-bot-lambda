require('dotenv').config()
const axios = require('axios').default;

let url = `https://discord.com/api/v8/applications/${process.env.APP_ID}/commands`

const headers = {
    "Authorization": `Bot ${process.env.BOT_TOKEN}`,
    "Content-Type": "application/json"
}

let command_data = {
    "name": "ask",
    "type": 1,
    "description": "question to ask",
    "options":[{
        "name": "question",
        "description": "question to ask",
        "type":3,
        "required": true
    }]
}

// let command_data = {
//     "name": "askMe",
//     "type": 3,
//     "description": "ask me a question",
// }

try{
    axios.post(url, JSON.stringify(command_data), {
        headers: headers,
    });
}catch(e){
    console.log(e);
}



