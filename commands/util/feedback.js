const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require("common-tags");
module.exports = class SayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'feedback',
			aliases: ['fb', 'report'],
			group: 'util',
			memberName: 'feedback',
			description: 'Give us a feedback.',
      			hidden: false,
      			guildOnly: true,
      			throttling: {
				usages: 1,
				duration: 10
			},
			args: [
				{
					key: 'text',
					prompt: 'What feedback would you like me to say?',
					type: 'string'
				}
			]
		});
	}

	async run(message, { text }) {
 		if (message.deletable) message.delete();
             	let reason = text;    
        	const channel = this.client.channels.cache.find(c => c.id === "707206789967380531")
   
        	const lembed = new MessageEmbed()
        	.setColor('#cce7e8')
        	.setTitle('Feedback successfully sent')
        	.setDescription('Hey there, thanks for being a part of this bot \^\_\^\nwe hope that with the feedback you give, this bot will be better in the future') 
        	.addField('Warning :','\_I will disappear in\_')
  		 message.channel.send(lembed).then(async message => {
      			message.delete({ timeout: 4000 });
      			await message.react("1️⃣");
      			await message.react("2️⃣");
      			await message.react("3️⃣");
      			await message.react("4️⃣");
      			await message.react("5️⃣");

    
   });
        const embed = new MessageEmbed()
            .setColor('#cce7e8')
            .setTimestamp()
            .setThumbnail(message.guild.iconURL())
            .setFooter(this.client.user.username, this.client.user.avatarURL())
            .setTitle("Report For Nezumi\'s Bot")
            .setDescription(stripIndents`
            ** Sender : ** ${message.author.username} ${message.author.id}
            ** From : ** ${message.guild.name}
            ** Feedback : ** ${reason}`);

        return channel.send(embed).then(async message => {
      		await message.react("✅");
      		await message.react("❌"); 
   });
  }
};
