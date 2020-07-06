const { Command } = require('discord.js-commando');

module.exports = class SkipAllCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'skipall',
      aliases: ['skip-all'],
      memberName: 'skipall',
      group: 'music',
      description: 'Skip all songs in queue',
      guildOnly: true
    });
  }

  run(message) {
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('Join a channel and try again');
    if (
      typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher == null
    ) {
      return message.reply('There is no song playing right now!');
    }
    if (!message.guild.musicData.queue)
      return message.say('There are no songs in queue');
    
    
              if(!message.guild.voice.connection)
  {
    return;
  }
  let userVoiceChannel = message.member.voice.channel;
  if (!userVoiceChannel) {
    return;
  }
  let clientVoiceConnection = message.guild.voice.connection;
  if (userVoiceChannel === clientVoiceConnection.channel) {
    message.guild.musicData.songDispatcher.end();
    message.guild.musicData.queue.length = 0; // clear queue
    return;
  } else {
    message.channel.send('You can only execute this command if you share the same voiceChannel!');
  }

  }
};
