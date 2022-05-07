import { client } from '../beapi_modules/BEAPI_CORE_SCRIPT.js';
import { Database } from '../Database/index.js';
client.on('OnChat', chat => {
    const sender = chat.sender, msg = chat.message, CHAR = '*'; //get sender, message, char
    const rawtext = (msg) => 'tellraw @s {"rawtext":[{"translate":"chat.type.text", "with":["' + sender.getName() + '", "' + msg + '"]}]}'; //rawtext
    const send = (msg) => sender.executeCommand(rawtext(msg)); //send message
    const censor = (msg) => {
        const convert = (match) => CHAR.repeat(match.length); //convert match to char
        const filter = new RegExp(Database.censorWord.join('|'), 'gi'); //filter censor word from message
        return msg.replace(filter, convert); //replace censor word with char
    };
    var check = false; //check profanity
    var cmd = client.commands.get('censorword').options; //get command option
    if (msg.includes(cmd.name) || msg.includes(cmd.aliases[0]))
        return; //if message includes command name or aliases
    Database.censorWord.forEach(word => {
        if (msg.includes(word)) { //if message includes censor word
            check = true;
            if (check) { //if check true
                send(censor(msg)); //send censored message
                chat.cancel(); //cancel chat
            }
        }
    });
});
