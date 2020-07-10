const { Command } = require('discord.js-commando');
const moment = require('moment');
const { stripIndents } = require('common-tags');

 let region = {
        "brazil": "Brazil :flag_br:",
        "eu-central": "Eu Central:flag_eu:",
        "singapore": ":Singapore flag_sg:",
        "us-central": "Us Central :flag_us:",
        "sydney": "Sydney :flag_au:",
        "us-east": "Us East :flag_us:",
        "us-south": "Us South :flag_us:",
        "us-west": "Us West :flag_us:",
        "eu-west": "Eu West :flag_eu:",
        "vip-us-east": "Vip Us East :flag_us:",
        "london": "London :flag_gb: London",
        "amsterdam": "Amsterdam :flag_nl:",
        "hongkong": "Hongkong :flag_hk:",
        "russia": "Russia :flag_ru:",
        "japan": "Japan :flag_jp:",
        "southafrica": "South Africa :flag_za:",
        "india" : "India :flag_in:"
    };
let def = {
  	"ALL" : "All Notifications",
  	"MENTIONS" : "Only Mentions"
}
module.exports = class ServerInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'server-info',
			aliases: ['server'],
			group: 'info',
			memberName: 'server',
			description: 'Get info on the server.',
      			hidden: false,
			details: `Get detailed information on the server.`,
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			}
		});
	}

	run(msg) {
			msg.guild.members.fetch().then(fetchedMembers => {
			const totaldnd = fetchedMembers.filter(member => member.presence.status === 'dnd');
			const totalonline = fetchedMembers.filter(member => member.presence.status === 'online');
			const totalidle = fetchedMembers.filter(member => member.presence.status === 'idle');
			const totaloff = fetchedMembers.filter(member => member.presence.status === 'offline');
			const rolestag = msg.guild.roles.cache             //ROLES DENGAN @ TAG COK
            		.filter(r => r.id !== msg.guild.id)
            		.map(r => r).join(", ") || 'none';
			return msg.embed({
      			title: 'Nezumi Server Info' ,
      			footer: {text: `${msg.author.username}`},
	  		color: '#cce7e8',
			description: `**${msg.guild.name}** (ID: ${msg.guild.id})\n**Owner: ${msg.guild.owner.user.tag} <:owner:711606469971148831>**\n(ID: ${msg.guild.ownerID})`,
			fields: [
				{
					name: '↣ Channels ↢',
					value: stripIndents`
						•》 ${msg.guild.channels.cache.filter(ch => ch.type === 'text').size} Text, ${msg.guild.channels.cache.filter(ch => ch.type === 'voice').size} Voice
            					•》 System Channel: ${msg.guild.systemChannel}
						•》 AFK: ${msg.guild.afkChannelID ? `<#${msg.guild.afkChannelID}> after ${msg.guild.afkTimeout / 60}min` : 'None.'}`,
					inline: true
				},
				{
					name: '↣ Member ↢',
					value: stripIndents`
						•》 Total Members ${msg.guild.memberCount}
            					•》 Humans: ${msg.guild.members.cache.filter(member => !member.user.bot).size} Bot: ${msg.guild.members.cache.filter(member => member.user.bot).size}
						•》 Online: ${totalonline.size}
						•》 Idle: ${totalidle.size}
						•》 Dont Disturb: ${totaldnd.size}
            					•》 Offline: ${totaloff.size}`,
					inline: true
				},
				{
					name: '↣ Other ↢',
					value: stripIndents`
						•》 Region: ${region[msg.guild.region]}
						•》 Created at: ${moment.utc(msg.guild.createdAt).format('MM/DD/YYYY h:mm A')}
            					•》 You Joined at : ${moment.utc(msg.member.joinedAt).format('MM/DD/YYYY h:mm A')}
				    		•》 Notification: ${def[msg.guild.defaultMessageNotifications]}
						•》 Verification Level: ${msg.guild.verificationLevel}`,
         				inline: false
				},
        			{
					name: `Roles\(${msg.guild.roles.cache.size}\)`,
					value: stripIndents`
					    ${rolestag}`
				}
				],
			thumbnail: { url: msg.guild.iconURL({ dynamic: true, size: 2048 }) }
		});
	})
	}
};
