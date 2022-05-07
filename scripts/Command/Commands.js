import { client } from '../beapi_modules/BEAPI_CORE_SCRIPT.js';
import { argsAPI } from './argsAPI/index.js';
import { Database, Modal } from '../Database/index.js';
import { profanity } from '../Profanity/index.js';
import { config } from '../Config/index.js';
client.commands.register({
    name: 'censorword',
    description: '\u00a7a[ \u00a7ecsw \u00a7a] \u00a7fCensor word options.',
    aliases: ['csw'], //command aliases
}, data => {
    var valid = argsAPI.registerArgs({
        data: data,
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
            }
        }
    });
    const sender = data.sender, args = data.args;
    const hasPermission = sender.hasTag(config.STAFFTAG); //check permission
    if (!hasPermission)
        return sender.sendMessage('\u00a7cYou don\'t have permission to use \'censorword\' command.'); //if not permission
    const cmd = (cmd) => sender.executeCommand(cmd); //execute command
    const rawtext = (msg, target) => 'tellraw ' + target + ' {"rawtext":[{"translate":"' + msg + '"}]}'; //rawtext
    const sendStaff = (msg) => cmd(rawtext(msg, '@a[tag=":staff:"]')); //send staff message
    const send = (msg) => sender.sendMessage(msg); //send player message
    const senderName = sender.getName(); //get name
    const subinput = [
        ['add', '\u00a7aUsage \u00a7f-> \u00a7e-csw add \u00a76<add: string> \u00a77Add censor word.'],
        ['remove', '\u00a7aUsage \u00a7f-> \u00a7e-csw remove \u00a76<remove: string> \u00a77Remove censor word.'],
        ['replace', '\u00a7aUsage \u00a7f-> \u00a7e-csw replace \u00a76<searchValue: string> <replaceValue: string> \u00a77Replace censor word.']
    ], subfind = subinput.findIndex(x => x[0] === args[0]);
    if (subinput[subfind] && args[1] === undefined) {
        valid[0] = true;
        return send(subinput[subfind][1]);
    }
    if (valid[0] === false)
        return send(valid[1] + '  \u00a7aAliases\u00a77: \u00a7f[ \u00a7ecsw \u00a7f]');
    switch (args[0]) { //switch subcommand
        case 'list': //censor word list
            if (!Database.censorWord.length) {
                return send('\u00a7cCensor word is empty.');
            }
            else {
                send(`\n\u00a7eCensor Word List\u00a77: \u00a7f\n`
                    + Database.censorWord.map(x => '\u00a77- \u00a7f' + x).join('\n')
                    + '\n\u00a7aTotal \u00a7e' + Database.censorWord.length + ' \u00a7fCensor Word.');
                return;
            }
        case 'add': //add censor word
            try {
                if (Database.censorWord.includes(args[1]))
                    return send('\u00a7c\'' + args[1] + '\' is duplicated in censor word.');
                Database.censorWord.push(args[1]);
                sendStaff('\u00a77(\u00a7r' + senderName + '\u00a77) \u00a7aAdd \u00a7fcensor word \u00a7e' + args[1]);
                Database.save();
                return;
            }
            catch (err) {
                return send('\u00a7aAdd \u00a7fnull (\u00a7cerror\u00a7f).');
            }
        case 'remove': //remove censor word
            try {
                if (!Database.censorWord.length)
                    return send('\u00a7cCensor word is empty.');
                if (Database.censorWord.includes(args[1])) {
                    Database.censorWord.splice(Database.censorWord.indexOf(args[1]), 1);
                    sendStaff('\u00a77(\u00a7r' + senderName + '\u00a77) \u00a7cRemove \u00a7fcensor word\u00a77: \u00a7e' + args[1]);
                    Database.save();
                    return;
                }
                else
                    return send('\u00a7cNo objective was found by the \'' + args[1] + '\'');
            }
            catch (err) {
                return send('\u00a7dRemove \u00a7fnull (\u00a7cerror\u00a7f).');
            }
        case 'replace': //replace censor word
            try {
                if (!Database.censorWord.length)
                    return send('\u00a7cCensor word is empty.');
                if (Database.censorWord.includes(args[2]))
                    return send('\u00a7c\'' + args[2] + '\' already exists.');
                if (Database.censorWord.includes(args[1])) {
                    Database.censorWord[Database.censorWord.indexOf(args[1])] = args[2];
                    sendStaff('\u00a77(\u00a7r' + senderName + '\u00a77) \u00a7dReplace \u00a7fcensor word\u00a77: \u00a7e' + args[1] + ' \u00a7fto \u00a7e' + args[2]);
                    Database.save();
                    return;
                }
                else
                    return send('\u00a7cNo objective was found by the \'' + args[1] + '\'');
            }
            catch (err) {
                return send('\u00a7dReplace \u00a7fnull (\u00a7cerror\u00a7f).');
            }
        case 'preset': //add censor word preset
            profanity.forEach(word => {
                if (Database.censorWord.includes(word))
                    return;
                Database.censorWord.push(word);
                Database.save();
            });
            sendStaff('\u00a77(\u00a7r' + senderName + '\u00a77) \u00a7aAdd \u00a7fcensor word \u00a7bpreset\u00a7f.');
            return;
        case 'setdf': //set default censor word
            Database.censorWord = profanity;
            sendStaff('\u00a77(\u00a7r' + senderName + '\u00a77) \u00a7fSet censor word to \u00a7bdefault\u00a7f.');
            Database.save();
            return;
        case 'rmall': //remove all censor word
            if (Database.censorWord[0] === undefined)
                return send('\u00a7cCensor word is empty.');
            Modal.findAll({ censorWord: Database.censorWord }).forEach(modal => {
                modal.delete();
                send(modal.censorWord.toString());
            });
            sendStaff('\u00a77(\u00a7r' + senderName + '\u00a77) \u00a7cRemove all \u00a7fcensor word.');
            return;
    }
});
