const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { shorten, base64, embedURL } = require('../../util/Util');

module.exports = class ChangelogCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'changelog',
			aliases: ['updates', 'commits'],
			group: 'util',
			memberName: 'changelog',
			description: 'Responds with the bot\'s latest 10 commits.',
			guarded: true,
			credit: [
				{
					name: 'GitHub',
					url: 'https://github.com/',
					reason: 'API',
					reasonURL: 'https://developer.github.com/v3/'
				}
			]
		});
	}

	async run(msg) {
		const { body } = await request
		.get(`https://api.github.com/repos/VeguiIzumi/NezumiYui/commits`)
		.set({ Authorization: `Basic ${base64(`VeguiIzumi:${process.env.GIT_PW}`)}` });
		const commits = body.slice(0, 10);
		const embed = new MessageEmbed()
		.setTitle(`[NezumiYui:master] Latest 10 commits`)
      		.setColor('#cce7e8')
		.setURL(`https://github.com/VeguiIzumi/NezumiYui/commits/master`)
		.setDescription(commits.map(commit => {
			const hash = embedURL(`\`${commit.sha.slice(0, 7)}\``, commit.html_url, false);
			return `${hash} ${shorten(commit.commit.message.split('\n')[0], 50)} - VeguiIzumi`;
			}).join('\n'));
			return msg.embed(embed);
	}
};
