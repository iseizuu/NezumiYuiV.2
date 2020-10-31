const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
module.exports = class SkipCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'skip',
            aliases: ['skip-song', 'advance-song'],
            memberName: 'skip',
            group: 'music',
            description: 'Skip the current playing song',
            guildOnly: true,
        });
    }

    run(message) {

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply('You need to join voice channel first');
        if (
            typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher == null) {
            return message.reply('There is no song playing right now!');
        }   
        
        if(!message.guild.voice.connection) {
            return;
        }
        let userVoiceChannel = message.member.voice.channel;
        if (!userVoiceChannel) {
            return;
        }
        let clientVoiceConnection = message.guild.voice.connection;
        if (userVoiceChannel === clientVoiceConnection.channel) {
            message.guild.musicData.songDispatcher.resume();
            message.guild.musicData.songDispatcher.end(); 
            const embed = new MessageEmbed()
                .setColor('#cce7e8')
                .setAuthor('Skip', 'https://cdn.discordapp.com/attachments/688763072864976906/706472099082141696/661493093811617803.gif')
                .addField('✔ | Successfully skipped', `**${message.guild.musicData.nowPlaying.title}**`)
                .setTimestamp()
                .setFooter(`Skipped by ${message.author.username}`);
            message.say(embed);
        }
        else {
            message.channel.send('You can only execute this command if you share the same voiceChannel!');
        }
         
    }
};
