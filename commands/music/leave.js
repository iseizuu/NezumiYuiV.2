const { Command } = require('discord.js-commando');

module.exports = class LeaveCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'leave',
      aliases: ['end'],
      group: 'music',
      memberName: 'leave',
      guildOnly: true,
      description: 'Leaves voice channel if in one'
    });
  }

  run(message) {
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('You need to join voice channel first');
    let userVoiceChannel = message.member.voice.channel;
    if (!userVoiceChannel) {
      return;
    }

    try { 
      let clientVoiceConnection = message.guild.voice.connection;
      if (userVoiceChannel === clientVoiceConnection.channel) {
      const connection = this.client.voice.connections.get(message.guild.id);
		  if (!connection) return message.reply('I am not in a voice channel.');
		  connection.channel.leave();
		  return message.reply(`Left **${connection.channel.name}**...`);
      message.guild.musicData.songDispatcher.end();
      message.guild.musicData.queue.length = 0;
      return;
    } else {
        message.channel.send('You can only execute this command if you share the same voiceChannel!');
    }
    } catch (err) {
			return message.reply(`Im not even in voice channel, did you see?`);
  }
    

  }
};
