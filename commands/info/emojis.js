const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const react = ['◀', '▶'];
module.exports = class EmojiCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'emojis',
            group: 'info',
            aliases: ['emot', 'emoji', 'emoji-list'],
            memberName: 'emoji',
            description: 'Show Emojis guild',
            guildOnly: true,
            format: 'emoji',
        });
    }

    async run(msg) {
        try {
            let emojis = msg.content.includes('--all') ? this.client.emojis.cache : msg.guild.emojis.cache;
            emojis = emojis.map(x => `${this.client.emojis.cache.get(x.id) ? this.client.emojis.cache.get(x.id).toString() : ''} | \`${this.client.emojis.cache.get(x.id) ? this.client.emojis.cache.get(x.id).toString() : ''}\``);
            const chunks = this.client.util.chunk(emojis, 10);
            let index = 0;
            const embed = new MessageEmbed()
                .setTitle(msg.guild.name)
                .setThumbnail(msg.guild.iconURL({size: 2048, dynamic: true}))
                .setColor('#cce7e8')
                .setDescription(chunks[index].join('\n'))
                .setFooter(`Page ${index + 1} of ${chunks.length}`);
            function awaitReactions(m) {
                const filter = (rect, usr) => react.includes(rect.emoji.name) && usr.id === msg.author.id;
                m.createReactionCollector(filter, { time: 30000, max: 1 })
                    .on('collect', col => {
                        const emo = col.emoji.name;
                        if (emo === react[0]) index--;
                        if (emo === react[1]) index++;
                        index = ((index % chunks.length) + chunks.length) % chunks.length;
                        embed.setDescription(chunks[index].join('\n'));
                        embed.setFooter(`Page ${index + 1} of ${chunks.length}`);
                        m.edit(embed);
                        return awaitReactions(m);
                    });
            }
            const thisMess = await msg.channel.send(embed);
            for (const r of react) {
                await thisMess.react(r);
            }
            return awaitReactions(thisMess);
        }
        catch (e) {
            msg.channel.send('Oh no error');
            return console.error(e);
        }
    }
};
