require('dotenv').config()
let url = `https://discord.com/api/v8/applications/${process.env.APP_ID}/guilds/${process.env.GUILD_ID}/commands`

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


// let command_data = {
//     "name": "foo",
//     "type": 1,
//     "description": "replies with bar",
//     "options": [
//         {
//             "name": "foo",
//             "description": "The type of animal",
//             "type": 3,
//             "required": True,
//             "choices": [
//                 {
//                     "name": "Dog",
//                     "value": "animal_dog"
//                 },
//                 {
//                     "name": "Cat",
//                     "value": "animal_cat"
//                 },
//                 {
//                     "name": "Penguin",
//                     "value": "animal_penguin"
//                 }
//             ]
//         },
//         {
//             "name": "only_smol",
//             "description": "Whether to show only baby animals",
//             "type": 5,
//             "required": False
//         }
//     ]
// }
