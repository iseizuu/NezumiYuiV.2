const Command = require('../../structures/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const { trimArray } = require('../../util/Util');
const flags = {
	DISCORD_EMPLOYEE: 'Discord Employee',
	DISCORD_PARTNER: 'Discord Partner',
	BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
	BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
	HYPESQUAD_EVENTS: 'HypeSquad Events',
	HOUSE_BRAVERY: 'House of Bravery <:bravery:711606468599873607>',
	HOUSE_BRILLIANCE: 'House of Brilliance <:briliance:711606467899162725>',
	HOUSE_BALANCE: 'House of Balance <:balance:711606469304254474>',
	EARLY_SUPPORTER: 'Early Supporter', //711610615348723721
	TEAM_USER: 'Team User',
	SYSTEM: 'System',
	VERIFIED_BOT: 'Verified Bot',
	VERIFIED_DEVELOPER: 'Verified Bot Developer <:balance:711610615348723721>'
};
module.exports = class UserCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'user',
			aliases: ['user-info', 'member', 'member-info'],
			group: 'info',
			memberName: 'user',
			description: 'Responds with detailed information on a user.',
      			hidden: false,
      			guildOnly: true,
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'user',
					prompt: 'Write the name or tag user would you like to get information ?',
					type: 'user',
          				default: msg => msg.author
				}
			]
		});
	}

	async run(msg, { user }) {
   try {
    		const game = await msg.guild.members.fetch(user.id);
		const userFlags = user.flags.toArray();
		const embed = new MessageEmbed()
      			.setTitle(user.tag)
			.setThumbnail(user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048}))
			.setDescription('All Information of user')
      			.addField('**↣ General Info ↢**',`•》ID : ${user.id}\n•》Discord Join Date : ${moment.utc(user.createdAt).format('MM/DD/YYYY h:mm A')}\n•》Verification : ${user.bot ? 'Bot' : 'Human'}\n•》Status : ${user.presence.status}\n•》Presence : ${game.presence.activities.length ? game.presence.activities[0] : "No presence"}\n•》Detail : ${game.presence.activities.length ? game.presence.activities[0].details : "No presence's running"}\n•》Flags : ${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}`)
			if (msg.guild) {

				try {
					const member = await msg.guild.members.fetch(user.id);
					const defaultRole = msg.guild.roles.cache.get(msg.guild.id);
					const roles = member.roles.cache
					.filter(role => role.id !== defaultRole.id)
					.sort((a, b) => b.position - a.position)
					.map(role => role.name);
					embed
					.addField('**↣ Server Member Info ↢**', `•》Nickname : ${member.nickname ? member.nickname : 'No nickname'}\n•》Server Join : ${moment.utc(member.joinedAt).format('MM/DD/YYYY h:mm A')}\n•》Higest Role : ${member.roles.highest.id === defaultRole.id ? 'None' : member.roles.highest.name}\n•》Hoist Role : ${member.roles.hoist ? member.roles.hoist.name : 'None'}  `)
					.addField(`**Roles** (${roles.length})`, roles.length ? trimArray(roles, 6).join(', ') : 'None')
      					.setFooter(`Req by : ${msg.author.tag}`)
      					.setTimestamp()
					.setColor(member.displayHexColor);
				} catch {
					embed.setFooter('Failed to resolve member, showing basic user information instead.');
			}
		}
		return msg.embed(embed);
	} catch {
		msg.reply('⚠ Error, please make sure the username is correct');
	}
  } 
};
