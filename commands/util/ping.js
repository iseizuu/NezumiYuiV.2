  
const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { formatNumber } = require('../../util/Util');
const { MessageEmbed } = require('discord.js');

module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            aliases: ['pong'],
            group: 'util',
            memberName: 'ping',
            description: 'Check ping bot',
            guarded: true,
            throttling: {
                usages: 1,
                duration: 10,
            },
        });
    }

    async run(msg) {
        const message = await msg.say('Pinging...');
        const ping = Math.round(message.createdTimestamp - msg.createdTimestamp);
        const embed = new MessageEmbed()
            .setColor('#cce7e8')
            .setTitle('Result')
            .setDescription(stripIndents`
			🏓 **P${'o'.repeat(Math.min(Math.round(ping / 100), 1500))}ng!** \`${formatNumber(ping)}ms\`

			💖 **Heartbeat:** \`${formatNumber(Math.round(this.client.ws.ping))}ms\``)
            .setFooter(msg.author.tag)
            .setTimestamp();
        message.delete();
        return msg.say(embed);
    }
};
