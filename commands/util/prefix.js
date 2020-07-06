const { stripIndents, oneLine } = require('common-tags');
const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
//const prefix = require('../../config.jspn')
module.exports = class PrefixCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'prefix',
			group: 'util',
			memberName: 'prefix',
			description: 'Shows or sets the command prefix.',
			format: '[prefix/"default"/"none"]',
			details: oneLine`
				If no prefix is provided, the current prefix will be shown.
				If the prefix is "default", the prefix will be reset to the bot's default prefix.
				If the prefix is "none", the prefix will be removed entirely, only allowing mentions to run commands.
				Only administrators may change the prefix.
			`,
			examples: ['prefix', 'prefix -', 'prefix omg!', 'prefix default', 'prefix none'],

			args: [
				{
					key: 'prefix',
					prompt: 'What would you like to set the bot\'s prefix to?',
					type: 'string',
					max: 5,
					default: ''
				}
			]
		});
	}

	async run(msg, args) {
     if (msg.deletable) msg.delete({ timeout : 5000 });
		// Just output the prefix
		if(!args.prefix) {
			const prefix = msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix;
      let embed = new MessageEmbed()
      .setColor('#cce7e8')
      .setTitle('Nezumi Prefix Customizable')
      .setDescription('Set your own prefix to your guild simply and easily')
      .addField('**🌐 Basic Info :**', `\`\`\`Default Prefix : ${prefix}\nUsage : ${prefix}prefix <your prefix set>\nReset Prefix : ${prefix}prefix reset\`\`\``)
      .addField('**🤖 My Prefix**', `\`\`\`${prefix ? `For now my prefix is ${prefix}.` : 'There is no command prefix.'}\nTo run commands, use ${msg.anyUsage('command')}.\`\`\``)
      .setFooter('NOTE : Your prefix may change to default again every bot reset, cuz i dont use DB')
			return msg.channel.send(embed).then(async msg => {
      msg.delete({ timeout: 15000 });

   });
		}

		// Check the user's permission before changing anything
		if(msg.guild) {
			if(!msg.member.hasPermission('ADMINISTRATOR') && !this.client.isOwner(msg.author)) {
				return msg.reply('Only administrators may change the command prefix.');
			}
		} else if(!this.client.isOwner(msg.author)) {
			return msg.reply('Only the bot owner(s) may change the global command prefix.');
		}

		// Save the prefix
		const lowercase = args.prefix.toLowerCase();
		const prefix = lowercase === 'none' ? '' : args.prefix;
		let response;
		if(lowercase === 'reset') {
			if(msg.guild) msg.guild.commandPrefix = null; else this.client.commandPrefix = null;
			const current = this.client.commandPrefix ? `\`\`${this.client.commandPrefix}\`\`` : 'no prefix';
      let embed2 = new MessageEmbed()
      .setTitle(`✅ Prefix Successfully Reset`)
      .setDescription(response = `Reset the command prefix to the default (currently ${current}).`)
		//	response = `Reset the command prefix to the default (currently ${current}).`;
           msg.say(embed2);
		} else {
			if(msg.guild) msg.guild.commandPrefix = prefix; else this.client.commandPrefix = prefix;
      let embed1 = new MessageEmbed()
      .setTitle(`✅ Prefix Successfully Changed`)
      .setDescription(response = prefix ? `Set the command prefix to \`\`${args.prefix}\`\`.` : 'Removed the command prefix entirely.')
			//response = prefix ? `Set the command prefix to \`\`${args.prefix}\`\`.` : 'Removed the command prefix entirely.';	
      msg.say(embed1);
    }

	//	await msg.reply(`${response} To run commands, use ${msg.anyUsage('command')}.`);
	//	return null;
	}
};