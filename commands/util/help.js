const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const AutoReplyCommand = require('../../structures/commands/AutoReply');

module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            aliases: ['commands', 'command-list'],
            group: 'util',
            memberName: 'help',
            description: 'Displays a list of available commands.',
            guarded: true,
            args: [
                {
                    key: 'command',
                    prompt: 'Which command would you like to view the help for?',
                    type: 'command',
                    default: '',
                },
            ],
        });
    }

    async run(msg, { command }) {
        if (!command) {
            const pict = 'https://i.ya-webdesign.com/images/svg-gear-transparent-background-3.gif';
            const embed = new MessageEmbed()
                .setAuthor('Nezumi Commands', pict)
                .setColor('#cce7e8');
            let cmdCount = 0;
            for (const group of this.client.registry.groups.values()) {
                const owner = this.client.isOwner(msg.author);
                const commands = group.commands.filter(cmd => {
                    if (owner) return true;
                    if (cmd.ownerOnly || cmd.hidden) return false;
                    const inBotList = msg.guild && this.client.botListGuilds.includes(msg.guild.id);
                    if (inBotList && cmd instanceof AutoReplyCommand) {
                        return false;
                    }
                    return true;
                });
                if (!commands.size) continue;
                cmdCount += commands.size;
                embed.addField(
                    `❯ ${group.name}`,
                    commands.map(cmd => `\`${cmd.name}\``).join(', ')
                );
            }
            if (cmdCount === this.client.registry.commands.size) {
                embed.setFooter(`${this.client.registry.commands.size} Commands`);
            }
            else {
                embed.setFooter(`${msg.author.tag} ${this.client.registry.commands.size} Commands (${cmdCount} Shown | nez.help [command])`);
        
            }return msg.say(embed);
        }
        const embad = new MessageEmbed()
            .setTitle('Command Detail')
            .setColor('#cce7e8')
            .setFooter(msg.author.tag, msg.author.displayAvatarURL())
            .setDescription( stripIndents`
				Command **${command.name}** ${command.guildOnly ? '  (Usable only in servers)' : ''}
				**Description:** ${command.description}${command.details ? `\n${command.details}` : ''}
				**Format:** ${msg.anyUsage(`${command.name} ${command.format || ''}`)}
				**Aliases:** ${command.aliases.join(', ') || 'None'}
				**Group:** ${command.group.name} (\`${command.groupID}:${command.memberName}\`)
				**NSFW:** ${command.nsfw ? 'Yes' : 'No'}`)
            .setTimestamp();
        return msg.say(embad);
    }
};
