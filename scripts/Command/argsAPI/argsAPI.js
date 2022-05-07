import { client } from '../../beapi_modules/BEAPI_CORE_SCRIPT.js';
class CmdArgs {
    registerArgs(options) {
        var get_cmd = client.commands.get('censorword').options;
        var cmd_name = get_cmd.name;
        var num_commands = Object.keys(options.commands).length;
        var commands = options.commands;
        var data = options.data;
        var num_args = data.args.length;
        var cmds_read = [[], [], []];
        var cmd = '\u00a7r\u00a7e';
        var aliases = get_cmd.aliases;
        var cmd_arg = '\u00a7r\u00a76';
        var cmd_info = '\u00a7r\u00a77\u00a7o';
        var cmd_help_title = `\u00a7r\u00a7bShowing \u00a7r-${cmd_name} \u00a7bcommand usage:\n`;
        var cmd_help_msg = `${cmd_help_title}`;
        for (let i = 0; i <= num_commands - 1; i++) {
            if (commands[i]['subcommand'] == undefined && commands[i]['arguments'] == undefined) {
                return [false, 'You must atleast add a subcommand OR a argument in the code'];
            }
            if (commands[i]['subcommand'] == undefined) {
                cmds_read[1].push(commands[i]['arguments']);
                cmds_read[0].push(i);
                cmd_help_msg = cmd_help_msg.concat(`  ${cmd}-${aliases} ${cmd_arg}${commands[i]['arguments']} ${cmd_info}${commands[i]['description']}\n`);
            }
            else {
                cmds_read[1].push(commands[i]['subcommand']);
                if (commands[i]['arguments'] == undefined) {
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
        var regex_subvar = /\bint\b|\bstring\b|\bnumber\b|\btarget\b/g;
        var regex_subvar2 = /<\w+:\s\w+>|\[\w+:\s\w+\]/g;
        var regex_subvar_option = /\[\w+:\s\w+\]/;
        for (var arg = 0; arg <= num_args - 1; arg++) {
            for (var i = 0; i <= num_commands - 1; i++) {
                if (data.args[arg] == cmds_read[1][i]) {
                    if (cmds_read[2][i] == undefined && num_args > 1)
                        return [false, cmd_help_msg];
                    if (cmds_read[2][i] == undefined)
                        return true;
                    let args2 = cmds_read[2][i].match(regex_subvar2);
                    arg++;
                    for (let j = 0; j <= args2.length - 1; j++) {
                        if (num_args > args2.length + 1)
                            return [false, cmd_help_msg];
                        let valid_var = args2[j].match(regex_subvar);
                        if (valid_var == null)
                            return [false, `ERROR: '${args2[j]}' this is not a valid variable! please code in a valid variable`];
                        if (args2[j].match(regex_subvar_option) == null && data.args[arg] == undefined) {
                            return [false, cmd_help_msg];
                        }
                        else {
                            if (data.args[arg] == undefined)
                                return true;
                        }
                        switch (valid_var.toString()) {
                            case 'int': {
                                if (isNaN(Number(data.args[arg])) == true)
                                    return [false, cmd_help_msg];
                                var num = parseFloat(data.args[arg]);
                                if (Number.isInteger(num) == false)
                                    return [false, cmd_help_msg];
                                arg++;
                                break;
                            }
                            case 'string': {
                                if (isNaN(Number(data.args[arg])) == false)
                                    return [false, cmd_help_msg];
                                arg++;
                                break;
                            }
                            case 'number': {
                                if (isNaN(Number(data.args[arg])) == true)
                                    return [false, cmd_help_msg];
                                arg++;
                                break;
                            }
                            case 'target': {
                                if (client.players.getByName(data.args[arg]) == undefined)
                                    return [false, `\u00a7cPlayer named \u00a7r'\u00a77${data.args[arg]}\u00a7r'\u00a7c does not exist`];
                                arg++;
                                break;
                            }
                        }
                    }
                    return true;
                }
                var args2 = cmds_read[1][i].match(regex_subvar2);
                if (args2 == null)
                    continue;
                for (var j = 0; j <= args2.length - 1; j++) {
                    if (num_args > args2.length)
                        return [false, cmd_help_msg];
                    var valid_var = args2[j].match(regex_subvar);
                    if (valid_var == null)
                        return [false, `ERROR: '${args2[j]}' this is not a valid variable! please code in a valid variable`];
                    if (args2[j].match(regex_subvar_option) == null && data.args[arg] == undefined) {
                        return [false, cmd_help_msg];
                    }
                    else {
                        if (data.args[arg] == undefined)
                            return true;
                    }
                    switch (valid_var.toString()) {
                        case 'int': {
                            if (isNaN(Number(data.args[arg])) == true)
                                return [false, cmd_help_msg];
                            let num = parseFloat(data.args[arg]);
                            if (Number.isInteger(num) == false)
                                return [false, cmd_help_msg];
                            arg++;
                            break;
                        }
                        case 'string': {
                            if (isNaN(Number(data.args[arg])) == false)
                                return [false, cmd_help_msg];
                            arg++;
                            break;
                        }
                        case 'number': {
                            if (isNaN(Number(data.args[arg])) == true)
                                return [false, cmd_help_msg];
                            arg++;
                            break;
                        }
                        case 'target': {
                            if (client.players.getByName(data.args[arg]) == undefined)
                                return [false, `\u00a7cPlayer named \u00a7r'\u00a77${data.args[arg]}\u00a7r'\u00a7c does not exist`];
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
export var argsAPI = new CmdArgs();
