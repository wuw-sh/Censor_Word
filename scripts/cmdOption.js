import { client } from './beapi_modules/BEAPI_CORE_SCRIPT.js';
import { argOptions } from './argOptions.js';
import { cwData } from './censorwordDatabase.js';
import { profanity } from './Profanity_Word/profanity.js';
client.commands.register(//register command
{
    name: 'censorword',
    description: '§a[ §ecsw §a] §fCensor word options.',
    aliases: ['csw'], //command aliases
}, data => {
    const valid = argOptions.registerArgs({
        data: data, name: 'censorword',
        commands: {
            0: { subcommand: 'list', description: 'Censor word list.' },
            1: { subcommand: 'add', arguments: '<add: string>', description: 'Add censor word.' },
            2: { subcommand: 'remove', arguments: '<remove: string>', description: 'Remove censor word.' },
            3: { subcommand: 'replace', arguments: '<searchValue: string> <replaceValue: string>', description: 'Replace censor word.' },
            4: { subcommand: 'preset', description: 'Add censor word preset.' },
            5: { subcommand: 'setdf', description: 'Set censor word to default.' },
            6: { subcommand: 'rmall', description: 'Remove all censor word.' } //remove all
        }
    });
    const permission = data.sender.hasTag(':staff:'); //check permission
    if (!permission)
        return data.sender.sendMessage('§cYou don\'t have permission to use \'censorword\' command.'); //if not permission
    const cmd = (cmd) => data.sender.executeCommand(cmd); //execute command
    const rawtext = (msg, target) => 'tellraw ' + target + ' {"rawtext":[{"translate":"' + msg + '"}]}'; //rawtext
    const sendStaff = (msg) => cmd(rawtext(msg, '@a[tag=":staff:"]')); //send staff message
    const send = (msg) => data.sender.sendMessage(msg); //send player message
    const senderName = data.sender.getName(); //get name
    const subinput = [
        ['add', '§aUsage §f-> §e-csw add §6<add: string> §7Add censor word.'],
        ['remove', '§aUsage §f-> §e-csw remove §6<remove: string> §7Remove censor word.'],
        ['replace', '§aUsage §f-> §e-csw replace §6<searchValue: string> <replaceValue: string> §7Replace censor word.']
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
                send(`\n§eCensor Word List§7: §f\n`);
                cwData.censorWord.forEach(word => {
                    send('§7- §f' + word);
                });
                return;
            }
            else
                return send('§fDon\'t have censor word.');
        case 'add': //add censor word
            try {
                if (data.args[1] === undefined)
                    return;
                if (cwData.censorWord.includes(data.args[1]))
                    return send('§c\'' + data.args[2] + '\' already exists.');
                cwData.censorWord.push(data.args[1]);
                sendStaff('§e(§r' + senderName + '§e) §aAdd §fcensor word §e' + data.args[1]);
                cwData.save();
                return;
            }
            catch (err) {
                return send('§aadd §fnull (§cerror§f).');
            }
        case 'remove': //remove censor word
            try {
                if (data.args[1] === undefined)
                    return;
                if (cwData.censorWord[0] === undefined)
                    return send('§fDon\'t have censor word.');
                if (cwData.censorWord.includes(data.args[1])) {
                    cwData.censorWord.splice(cwData.censorWord.indexOf(data.args[1]), 1);
                    sendStaff('§e(§r' + senderName + '§e) §cRemove §fcensor word§7: §e' + data.args[1]);
                    cwData.save();
                    return;
                }
                else
                    return send('§cNo objective was found by the \'' + data.args[1] + '\'');
            }
            catch (err) {
                return send('§dreplace §fnull (§cerror§f).');
            }
        case 'replace': //replace censor word
            try {
                if (data.args[1] === undefined)
                    return;
                if (cwData.censorWord[0] === undefined)
                    return send('§fDon\'t have censor word.');
                if (cwData.censorWord.includes(data.args[2]))
                    return send('§c\'' + data.args[2] + '\' already exists.');
                if (cwData.censorWord.includes(data.args[1])) {
                    cwData.censorWord[cwData.censorWord.indexOf(data.args[1])] = data.args[2];
                    sendStaff('§e(§r' + senderName + '§e) §dReplace §fcensor word§7: §e' + data.args[1] + ' §fto §e' + data.args[2]);
                    cwData.save();
                    return;
                }
                else
                    return send('§cNo objective was found by the \'' + data.args[1] + '\'');
            }
            catch (err) {
                return send('§dreplace §fnull (§cerror§f).');
            }
        case 'preset': //add censor word preset
            profanity.forEach(word => {
                if (cwData.censorWord.includes(word))
                    return;
                cwData.censorWord.push(word);
                cwData.save();
            });
            sendStaff('§e(§r' + senderName + '§e) §aAdd §fcensor word §bpreset§f.');
            return;
        case 'setdf': //set default censor word
            cwData.censorWord = profanity;
            sendStaff('§e(§r' + senderName + '§e) §fSet censor word to §bdefault§f.');
            cwData.save();
            return;
        case 'rmall': //remove all censor word
            if (cwData.censorWord[0] === undefined)
                return send('§fDon\'t have censor word.');
            cwData.censorWord = [];
            sendStaff('§e(§r' + senderName + '§e) §cRemove §fall censor word.');
            cwData.save();
            return;
    }
    if (valid[0] === false) { //if valid false
        send(valid[1]);
        send('  §aAliases§7: §f[ §ecsw §f]');
        return;
    }
});
