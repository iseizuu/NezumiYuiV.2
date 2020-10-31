const Command = require('../../structures/Command');
const { MessageEmbed, version: djsVersion } = require('discord.js');
const { version: commandoVersion } = require('discord.js-commando');
const moment = require('moment');
require('moment-duration-format');
const { formatNumber, embedURL } = require('../../util/Util');
const { version } = require('../../package');
const permissions = require('../../assets/json/permissions');
const prefix = require('../../config.json');
module.exports = class InfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'botinfo',
            aliases: ['stats', 'uptime', 'info'],
            group: 'util',
            memberName: 'info',
            description: 'Responds with detailed bot information.',
            guarded: true,
            clientPermissions: ['EMBED_LINKS'],
        });
    }

    async run(msg) {
        const invite = await this.client.generateInvite(permissions);
        const srvr = 'https://discord.gg/YmJEcFR';
        const vte = 'https://top.gg/bot/686908676606263326';
        const owners = 'https://cdn.discordapp.com/attachments/688763072864976906/705776573546233937/702557406361550848.gif';
        const webs = 'https://nezumiyui.000webhostapp.com/';
        const embed = new MessageEmbed()
            .setAuthor('Nezumi Stats', `${owners}`)
            .setThumbnail(this.client.user.displayAvatarURL()) //↣↢
            .setColor('#cce7e8')
            .setFooter('©Vegui', `${this.client.users.cache.find(c => c.id === '271576733168173057').avatarURL()}`)
            .setTimestamp()
            .addField('**📂 General Info**', `\`\`\`apache\n•》 Servers : ${formatNumber(this.client.guilds.cache.size)}\n•》 Users : ${formatNumber(this.client.users.cache.size)}\n•》 Channels : ${formatNumber(this.client.channels.cache.size)}\n•》 Commands : ${this.client.registry.commands.size}\n•》 Prefix : ${prefix.prefix}\`\`\``)
            .addField('**⚙  Os Information**', `\`\`\`css\n•》 Platform : Linux X64\n•》 Cpu : ${require('os').cpus()[0].model}\n•》 Shards : ${this.client.options.shardCount}\n•》 Memory Usage : ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB\n•》 Uptime : ${moment.duration(this.client.uptime).format('d:hh:mm:ss')}\n•》 Version : ${version}\n•》 Node.js : ${process.version}\n•》 Discord.js : ${djsVersion}\n•》 Commando : ${commandoVersion}\n•》 Ping : ${formatNumber(Math.round(this.client.ws.ping))} ms\`\`\` `)
            .addField('**📌 Other Stuff**', `•》  Support Server : ${embedURL('Join Server', srvr)}\n•》Website : ${embedURL('DEMO', webs)}\n•》  Invite Me : ${embedURL('Add Me', invite)}\n•》  Vote Me : ${embedURL('VOTE', vte)}`)
            .addField('**👤  Dev**', `\|\|<@271576733168173057> OR ${this.client.users.cache.find(c => c.id === '271576733168173057').tag}\|\|`);
        return msg.embed(embed);
    }
};
