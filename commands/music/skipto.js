const { Command } = require('discord.js-commando');

module.exports = class SkipToCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'skipto',
      memberName: 'skipto',
      group: 'music',
      description:
        'Skip to a specific song in the queue, provide the song number as an argument',
      guildOnly: true,
      args: [
        {
          key: 'songNumber',
          prompt:
            'What is the number in queue of the song you want to skip to?, it needs to be greater than 1',
          type: 'integer'
        }
      ]
    });
  }

  run(message, { songNumber }) {
//       if (!message.member.permissions.has("MANAGE_CHANNELS") && message.guild.me.permissions.has("MANAGE_CHANNELS")) return message.channel.send("Only author can skip :)");
    if (songNumber < 1 && songNumber >= message.guild.musicData.queue.length) {
      return message.reply('Please enter a valid song number');
    }
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('Join a channel and try again');

    if (
      typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher == null
    ) {
      return message.reply('There is no song playing right now!');
    }

    if (message.guild.musicData.queue < 1)
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
    message.guild.musicData.queue.splice(0, songNumber - 1);
    message.guild.musicData.songDispatcher.end();
    return;
  } else {
    message.channel.send('You can only execute this command if you share the same voiceChannel!');
  }

  }
};
