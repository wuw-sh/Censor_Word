import { client } from './beapi_modules/BEAPI_CORE_SCRIPT.js';
;
class CmdArgs {
    registerArgs(options) { var cmd_name = options.name; var num_commands = Object.keys(options.commands).length; var commands = options.commands; var data = options.data; var num_args = data.args.length; var cmds_read = [[], [], []]; var cmd = '§r§e'; var aliases = client.commands.get(options.name).options.aliases; var cmd_arg = '§r§6'; var cmd_info = '§r§7§o'; var cmd_help_title = `§r§3Showing §r-${cmd_name} §3command usage:\n`; var cmd_help_msg = `${cmd_help_title}`; for (var i = 0; i <= num_commands - 1; i++) {
        if (commands[i]['subcommand'] == undefined && commands[i]['arguments'] == undefined) {
            return [false, 'You must atleast add a subcommand OR a argument in the code'];
        }
        ;
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
            ;
        }
        ;
        if (cmds_read[0].includes(i))
            continue;
        cmds_read[2].push(commands[i]['arguments']);
    } ; var regex_subvar = /\bint\b|\bstring\b|\bnumber\b|\btarget\b/g; var regex_subvar2 = /<\w+:\s\w+>|\[\w+:\s\w+\]/g; var regex_subvar_option = /\[\w+:\s\w+\]/; for (var arg = 0; arg <= num_args - 1; arg++) {
        for (var i = 0; i <= num_commands - 1; i++) {
            if (data.args[arg] == cmds_read[1][i]) {
                if (cmds_read[2][i] == undefined && num_args > 1)
                    return [false, cmd_help_msg];
                if (cmds_read[2][i] == undefined)
                    return true;
                var args2 = cmds_read[2][i].match(regex_subvar2);
                arg++;
                for (var j = 0; j <= args2.length - 1; j++) {
                    if (num_args > args2.length + 1)
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
                    ;
                    switch (valid_var.toString()) {
                        case 'int':
                            {
                                if (isNaN(data.args[arg]) == true)
                                    return [false, cmd_help_msg];
                                var num = parseFloat(data.args[arg]);
                                if (Number.isInteger(num) == false)
                                    return [false, cmd_help_msg];
                                arg++;
                                continue;
                            }
                            ;
                        case 'string':
                            {
                                if (isNaN(data.args[arg]) == false)
                                    return [false, cmd_help_msg];
                                arg++;
                                continue;
                            }
                            ;
                        case 'number':
                            {
                                if (isNaN(data.args[arg]) == true)
                                    return [false, cmd_help_msg];
                                arg++;
                                continue;
                            }
                            ;
                        case 'target':
                            {
                                if (client.players.getByName(data.args[arg]) == undefined)
                                    return [false, `§cPlayer named §r'§7${data.args[arg]}§r'§c does not exist`];
                                arg++;
                                continue;
                            }
                            ;
                    }
                    ;
                }
                ;
                return true;
            }
            ;
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
                ;
                switch (valid_var.toString()) {
                    case 'int':
                        {
                            if (isNaN(data.args[arg]) == true)
                                return [false, cmd_help_msg];
                            var num = parseFloat(data.args[arg]);
                            if (Number.isInteger(num) == false)
                                return [false, cmd_help_msg];
                            arg++;
                            continue;
                        }
                        ;
                    case 'string':
                        {
                            if (isNaN(data.args[arg]) == false)
                                return [false, cmd_help_msg];
                            arg++;
                            continue;
                        }
                        ;
                    case 'number':
                        {
                            if (isNaN(data.args[arg]) == true)
                                return [false, cmd_help_msg];
                            arg++;
                            continue;
                        }
                        ;
                    case 'target':
                        {
                            if (client.players.getByName(data.args[arg]) == undefined)
                                return [false, `§cPlayer named §r'§7${data.args[arg]}§r'§c does not exist`];
                            arg++;
                            continue;
                        }
                        ;
                }
                ;
            }
            ;
            return true;
        }
        ;
    } ; return [false, cmd_help_msg]; }
    ;
}
;
export var argOptions = new CmdArgs();
