const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class ApiCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'apistatus',
			aliases: ['apis'],
			group: 'util',
			memberName: 'apis',
			description: 'Check api status',
            		guarded: true,
            		throttling: {
				usages: 2,
				duration: 10
			},
		});
	}

	async run(msg) {
		const ae = {
            		"alive": "<:online:735119429016485920> : Api is Online"
    		}; 
    		this.client.fetch.get(process.env.apis).then(a => {
       			const embed = new MessageEmbed()
        		.setTitle('Api status')
        		.setDescription(ae[a.body.status])
        		.setFooter(msg.author.tag)
        		.setTimestamp();
        		msg.say(embed);
    }).catch(er => {
			msg.embed({description: '<:offline:735121280851902555> : Down'})
    })
	}
};
