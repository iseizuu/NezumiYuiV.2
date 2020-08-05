const { Command } = require('discord.js-commando');

module.exports = class LeaveCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'leave',
      aliases: ['end'],
      group: 'music',
      memberName: 'leave',
      guildOnly: true,
      description: 'Leaves voice channel'
    });
  }

	run(msg) {
    const connection = this.client.voice.connections.get(msg.guild.id);
    if (!connection) return msg.reply('I am not in a voice channel.');
    if(msg.guild.musicData.isPlaying === true && msg.member.voice.channel.id !== msg.guild.musicData.nowPlaying.voiceChannel.id) {
      return msg.channel.send({embed : {
          description: `Error accepting you request, because you not in **${msg.guild.musicData.nowPlaying.voiceChannel.name}** `,
          color: 'RED'
      }})
    }
    
    if(msg.guild.musicData.isPlaying === true) {
      msg.guild.musicData.songDispatcher.end();
      connection.channel.leave();
      
    }
    else {
      msg.react("✅")
      connection.channel.leave();
      return msg.reply(`Left **${connection.channel.name}**...`);
    }

	}
};