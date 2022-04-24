import { client } from '../beapi_modules/BEAPI_CORE_SCRIPT.js';
class CmdArgs {
    registerArgs(options) {
        const cmd_name = options.name;
        const num_commands = Object.keys(options.commands).length;
        const commands = options.commands;
        const data = options.data;
        const num_args = data.args.length;
        const cmds_read = [[], [], []];
        const cmd = '§r§e';
        const aliases = client.commands.get(options.name).options.aliases;
        const cmd_arg = '§r§6';
        const cmd_info = '§r§7§o';
        const cmd_help_title = `§r§3Showing §r-${cmd_name} §3command usage:\n`;
        let cmd_help_msg = `${cmd_help_title}`;
        for (let i = 0; i <= num_commands - 1; i++) {
            if (commands[i]['subcommand'] === undefined && commands[i]['arguments'] === undefined) {
                return [false, 'You must atleast add a subcommand OR a argument in the code'];
            }
            if (commands[i]['subcommand'] === undefined) {
                cmds_read[1].push(commands[i]['arguments']);
                cmds_read[0].push(i);
                cmd_help_msg = cmd_help_msg.concat(`  ${cmd}-${aliases} ${cmd_arg}${commands[i]['arguments']} ${cmd_info}${commands[i]['description']}\n`);
            }
            else {
                cmds_read[1].push(commands[i]['subcommand']);
                if (commands[i]['arguments'] === undefined) {
                    cmd_help_msg = cmd_help_msg.concat(`  ${cmd}-${aliases} ${commands[i]['subcommand']} ${cmd_info}${commands[i]['description']}\n`);
                }
                else {
                    cmd_help_msg = cmd_help_msg.concat(`  ${cmd}-${aliases} ${commands[i]['subcommand']} ${cmd_arg}${commands[i]['arguments']} ${cmd_info}${commands[i]['description']}\n`);
                }
            }
            if (cmds_read[0].includes(i))
                continue;
            cmds_read[2].push(commands[i]['arguments']);
        }
        const regex_subvar = /\bint\b|\bstring\b|\bnumber\b|\btarget\b/g;
        const regex_subvar2 = /<\w+:\s\w+>|\[\w+:\s\w+\]/g;
        const regex_subvar_option = /\[\w+:\s\w+\]/;
        for (let arg = 0; arg <= num_args - 1; arg++) {
            for (let i = 0; i <= num_commands - 1; i++) {
                if (data.args[arg] === cmds_read[1][i]) {
                    if (cmds_read[2][i] === undefined && num_args > 1)
                        return [false, cmd_help_msg];
                    if (cmds_read[2][i] === undefined)
                        return true;
                    let args2 = cmds_read[2][i].match(regex_subvar2);
                    arg++;
                    for (let j = 0; j <= args2.length - 1; j++) {
                        if (num_args > args2.length + 1)
                            return [false, cmd_help_msg];
                        let valid_var = args2[j].match(regex_subvar);
                        if (valid_var === null)
                            return [false, `ERROR: '${args2[j]}' this is not a valid variable! please code in a valid variable`];
                        if (args2[j].match(regex_subvar_option) === null && data.args[arg] === undefined) {
                            return [false, cmd_help_msg];
                        }
                        else {
                            if (data.args[arg] === undefined)
                                return true;
                        }
                        switch (valid_var.toString()) {
                            case 'int': {
                                if (isNaN(data.args[arg]) === true)
                                    return [false, cmd_help_msg];
                                let num = parseFloat(data.args[arg]);
                                if (Number.isInteger(num) === false)
                                    return [false, cmd_help_msg];
                                arg++;
                                break;
                            }
                            case 'string': {
                                if (isNaN(data.args[arg]) === false)
                                    return [false, cmd_help_msg];
                                arg++;
                                break;
                            }
                            case 'number': {
                                if (isNaN(data.args[arg]) === true)
                                    return [false, cmd_help_msg];
                                arg++;
                                break;
                            }
                            case 'target': {
                                if (client.players.getByName(data.args[arg]) === undefined)
                                    return [false, `§cPlayer named §r'§7${data.args[arg]}§r'§c does not exist`];
                                arg++;
                                break;
                            }
                        }
                    }
                    return true;
                }
                let args2 = cmds_read[1][i].match(regex_subvar2);
                if (args2 === null)
                    continue;
                for (let j = 0; j <= args2.length - 1; j++) {
                    if (num_args > args2.length)
                        return [false, cmd_help_msg];
                    let valid_var = args2[j].match(regex_subvar);
                    if (valid_var === null)
                        return [false, `ERROR: '${args2[j]}' this is not a valid variable! please code in a valid variable`];
                    if (args2[j].match(regex_subvar_option) === null && data.args[arg] === undefined) {
                        return [false, cmd_help_msg];
                    }
                    else {
                        if (data.args[arg] === undefined)
                            return true;
                    }
                    switch (valid_var.toString()) {
                        case 'int': {
                            if (isNaN(data.args[arg]) === true)
                                return [false, cmd_help_msg];
                            let num = parseFloat(data.args[arg]);
                            if (Number.isInteger(num) === false)
                                return [false, cmd_help_msg];
                            arg++;
                            break;
                        }
                        case 'string': {
                            if (isNaN(data.args[arg]) === false)
                                return [false, cmd_help_msg];
                            arg++;
                            break;
                        }
                        case 'number': {
                            if (isNaN(data.args[arg]) === true)
                                return [false, cmd_help_msg];
                            arg++;
                            break;
                        }
                        case 'target': {
                            if (client.players.getByName(data.args[arg]) === undefined)
                                return [false, `§cPlayer named §r'§7${data.args[arg]}§r'§c does not exist`];
                            arg++;
                            break;
                        }
                    }
                }
                return true;
            }
        }
        return [false, cmd_help_msg];
    }
    ;
}
export var argOptions = new CmdArgs();
