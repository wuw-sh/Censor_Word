import { client } from '../beapi_modules/BEAPI_CORE_SCRIPT.js';
import { argOptions } from './argOptions.js';
import { cwData } from '../Database/index.js';
import { profanity } from '../Profanity/index.js';
client.commands.register(//register command
{
    name: 'censorword',
    description: '\xA7a[ \xA7ecsw \xA7a] \xA7fCensor word options.',
    aliases: ['csw'], //command aliases
}, data => {
    const valid = argOptions.registerArgs({
        data: data, name: 'censorword',
        commands: {
            0: {
                subcommand: 'list',
                description: 'Censor word list.'
            },
            1: {
                subcommand: 'add',
                arguments: '<add: string>',
                description: 'Add censor word.'
            },
            2: {
                subcommand: 'remove',
                arguments: '<remove: string>',
                description: 'Remove censor word.'
            },
            3: {
                subcommand: 'replace',
                arguments: '<searchValue: string> <replaceValue: string>',
                description: 'Replace censor word.'
            },
            4: {
                subcommand: 'preset',
                description: 'Add censor word preset.'
            },
            5: {
                subcommand: 'setdf',
                description: 'Set censor word to default.'
            },
            6: {
                subcommand: 'rmall',
                description: 'Remove all censor word.'
            } //remove all
        }
    });
    const permission = data.sender.hasTag(':staff:'); //check permission
    if (!permission)
        return data.sender.sendMessage('\xA7cYou don\'t have permission to use \'censorword\' command.'); //if not permission
    const cmd = (cmd) => data.sender.executeCommand(cmd); //execute command
    const rawtext = (msg, target) => 'tellraw ' + target + ' {"rawtext":[{"translate":"' + msg + '"}]}'; //rawtext
    const sendStaff = (msg) => cmd(rawtext(msg, '@a[tag=":staff:"]')); //send staff message
    const send = (msg) => data.sender.sendMessage(msg); //send player message
    const senderName = data.sender.getName(); //get name
    const subinput = [
        ['add', '\xA7aUsage \xA7f-> \xA7e-csw add \xA76<add: string> \xA77Add censor word.'],
        ['remove', '\xA7aUsage \xA7f-> \xA7e-csw remove \xA76<remove: string> \xA77Remove censor word.'],
        ['replace', '\xA7aUsage \xA7f-> \xA7e-csw replace \xA76<searchValue: string> <replaceValue: string> \xA77Replace censor word.']
    ];
    for (let i = 0; i < subinput.length; i++) { //for sub input
        if ((data.args[0] === subinput[i][0]) && data.args[1] === undefined) {
            valid[0] = true;
            return send(subinput[i][1]);
        }
    }
    switch (data.args[0]) { //switch subcommand
        case 'list': //censor word list
            if (cwData.censorWord[0] !== undefined) {
                send(`\n\xA7eCensor Word List\xA77: \xA7f\n`);
                cwData.censorWord.forEach(word => {
                    send('\xA77- \xA7f' + word);
                });
                return;
            }
            else
                return send('\xA7fDon\'t have censor word.');
        case 'add': //add censor word
            try {
                if (data.args[1] === undefined)
                    return;
                if (cwData.censorWord.includes(data.args[1]))
                    return send('\xA7c\'' + data.args[2] + '\' already exists.');
                cwData.censorWord.push(data.args[1]);
                sendStaff('\xA7e(\xA7r' + senderName + '\xA7e) \xA7aAdd \xA7fcensor word \xA7e' + data.args[1]);
                cwData.save();
                return;
            }
            catch (err) {
                return send('\xA7aAdd \xA7fnull (\xA7cerror\xA7f).');
            }
        case 'remove': //remove censor word
            try {
                if (data.args[1] === undefined)
                    return;
                if (cwData.censorWord[0] === undefined)
                    return send('\xA7fDon\'t have censor word.');
                if (cwData.censorWord.includes(data.args[1])) {
                    cwData.censorWord.splice(cwData.censorWord.indexOf(data.args[1]), 1);
                    sendStaff('\xA7e(\xA7r' + senderName + '\xA7e) \xA7cRemove \xA7fcensor word\xA77: \xA7e' + data.args[1]);
                    cwData.save();
                    return;
                }
                else
                    return send('\xA7cNo objective was found by the \'' + data.args[1] + '\'');
            }
            catch (err) {
                return send('\xA7dRemove \xA7fnull (\xA7cerror\xA7f).');
            }
        case 'replace': //replace censor word
            try {
                if (data.args[1] === undefined)
                    return;
                if (cwData.censorWord[0] === undefined)
                    return send('\xA7fDon\'t have censor word.');
                if (cwData.censorWord.includes(data.args[2]))
                    return send('\xA7c\'' + data.args[2] + '\' already exists.');
                if (cwData.censorWord.includes(data.args[1])) {
                    cwData.censorWord[cwData.censorWord.indexOf(data.args[1])] = data.args[2];
                    sendStaff('\xA7e(\xA7r' + senderName + '\xA7e) \xA7dReplace \xA7fcensor word\xA77: \xA7e' + data.args[1] + ' \xA7fto \xA7e' + data.args[2]);
                    cwData.save();
                    return;
                }
                else
                    return send('\xA7cNo objective was found by the \'' + data.args[1] + '\'');
            }
            catch (err) {
                return send('\xA7dReplace \xA7fnull (\xA7cerror\xA7f).');
            }
        case 'preset': //add censor word preset
            profanity.forEach(word => {
                if (cwData.censorWord.includes(word))
                    return;
                cwData.censorWord.push(word);
                cwData.save();
            });
            sendStaff('\xA7e(\xA7r' + senderName + '\xA7e) \xA7aAdd \xA7fcensor word \xA7bpreset\xA7f.');
            return;
        case 'setdf': //set default censor word
            cwData.censorWord = profanity;
            sendStaff('\xA7e(\xA7r' + senderName + '\xA7e) \xA7fSet censor word to \xA7bdefault\xA7f.');
            cwData.save();
            return;
        case 'rmall': //remove all censor word
            if (cwData.censorWord[0] === undefined)
                return send('\xA7fDon\'t have censor word.');
            cwData.censorWord = [];
            sendStaff('\xA7e(\xA7r' + senderName + '\xA7e) \xA7cRemove \xA7fall censor word.');
            cwData.save();
            return;
    }
    if (valid[0] === false) { //if valid false
        send(valid[1]);
        send('  \xA7aAliases\xA77: \xA7f[ \xA7ecsw \xA7f]');
        return;
    }
});
