const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const { embedURL } = require('../../util/Util');

module.exports = class AvatarCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            aliases: ['ava', 'pp', 'profilepicture'],
            group: 'info',
            memberName: 'avatar',
            description: 'Showing user\'s avatar.',
            args: [
                {
                    key: 'user',
                    prompt: 'Tag user to get avatar info?',
                    type: 'user',
                    default: msg => msg.author,
                },
            ],
        });
    }

    run(msg, { user }) {
        const formats = ['png'];
        if (user.avatar) formats.push('jpg', 'webp');
        const format = user.avatar && user.avatar.startsWith('a_') ? 'gif' : 'png';
        if (format === 'gif') formats.push('gif');
        const embed = new MessageEmbed()
            .setTitle(user.tag)
            .setDescription(formats.map(fmt => embedURL(fmt.toUpperCase(), user.displayAvatarURL({ format: fmt, size: 2048 }))).join(' | '))
            .setImage(user.displayAvatarURL({ format, size: 2048 }))
            .setFooter(`Req by : ${msg.author.username}`)
            .setColor('#cce7e8');
        return msg.embed(embed);
    }
};
