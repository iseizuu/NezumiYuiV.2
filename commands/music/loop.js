const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
module.exports = class LoopCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'loop',
            group: 'music',
            memberName: 'loop',
            guildOnly: true,
            description: 'Loop the current playing song',
            args: [
                {
                    key: 'numOfTimesToLoop',
                    type: 'integer',
                    prompt: 'How many times do you want to loop the song? Max 10',
                    validate: numOfTimesToLoop => numOfTimesToLoop >= 1 && numOfTimesToLoop <= 10,
                },
            ],
        });
    }

    run(message, { numOfTimesToLoop }) {
        if (!message.guild.musicData.isPlaying) {
            return message.say('There is no song playing right now!');
        }
        else if (
            message.guild.musicData.isPlaying &&
      message.guild.triviaData.isTriviaRunning
        ) {
            return message.say('You cannot loop over a trivia!');
        }

        for (let i = 0; i < numOfTimesToLoop; i++) {
            message.guild.musicData.queue.unshift(message.guild.musicData.nowPlaying);
        }
        const embed = new MessageEmbed()
            .setTitle('🎶 Looped')
            .setColor('#cce7e8')
            .setDescription(`${message.guild.musicData.nowPlaying.title} looped ${numOfTimesToLoop} ${(numOfTimesToLoop == 1) ? 'time' : 'times'}`)
            .setFooter('NOTE : You can add number of looping to');
        message.channel.send(embed);
        return;
    }
};