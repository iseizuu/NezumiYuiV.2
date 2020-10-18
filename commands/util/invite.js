  const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class UtilCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'invite',
			aliases: ['vote'],
			group: 'util',
			memberName: 'invite',
			description: 'Want to invite or vote me?',
			guarded: true,
			throttling: {
				usages: 2,
				duration: 5
			},
		});
	}

	async run(msg) {
		const embed = new MessageEmbed()
		.setTitle('Invite / Vote')
		.setDescription(`${this.client.util.embedURL('Invite Me', `${this.client.generateInvite(['ADMINISTRATOR'])}`)} | ${this.client.util.embedURL('Vote Me', 'https://top.gg/bot/686908676606263326/vote')} `)
		.setFooter(msg.author.tag)
		.setTimestamp();
		msg.say(embed);
	}
};
