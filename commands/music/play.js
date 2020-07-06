const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const Youtube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const { youtubeAPI } = require('../../config.json');
const youtube = new Youtube(youtubeAPI);

module.exports = class PlayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'play',
      aliases: ['p', 'add'],
      memberName: 'play',
      group: 'music',
      description: 'Play any song or playlist from youtube',
      guildOnly: true,
      clientPermissions: ['SPEAK', 'CONNECT'],
      throttling: {
        usages: 1,
        duration: 10
      },
      args: [
        {
          key: 'query',
          prompt: 'What song or playlist would you like to listen to? \n Just write the song in down bellow, without prefix',
          type: 'string',
          validate: function(query) {
            return query.length > 0 && query.length < 200;
          }
        }
      ]
    });
  }

  async run(message, { query }) {
     //if (message.author.id !== '271576733168173057') return message.say('Sorry, music command is being rewritten :(');
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.say('Join a channel and try again');
		if (!voiceChannel.permissionsFor(this.client.user).has(['CONNECT', 'SPEAK', 'VIEW_CHANNEL'])) {
			return message.reply('I\'m missing the "Connect", "Speak", or "View Channel" permission for this channel.');
		}
    if (message.guild.triviaData.isTriviaRunning == true) {
      return message.say('Please try after the trivia has ended');
    }

    if (
      // if the user entered a youtube playlist url
      query.match(
        /^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/
      )
    ) {
      const playlist = await youtube.getPlaylist(query).catch(function() {
        return message.say('Playlist is either private or it does not exist!');
      });
      // remove the 10 if you removed the queue limit conditions below
      const videosObj = await playlist.getVideos(10).catch(function() {
        return message.say(
          'There was a problem getting one of the videos in the playlist!'
        );
      });
      for (let i = 0; i < videosObj.length; i++) {
        const video = await videosObj[i].fetch();
        // this can be uncommented if you choose to limit the queue
        // if (message.guild.musicData.queue.length < 10) {
        //
        message.guild.musicData.queue.push(
          PlayCommand.constructSongObj(video, voiceChannel)
        );
        // } else {
        //   return message.say(
        //     `I can't play the full playlist because there will be more than 10 songs in queue`
        //   );
        // }
      }
      if (message.guild.musicData.isPlaying == false) {
        message.guild.musicData.isPlaying = true;
        return PlayCommand.playSong(message.guild.musicData.queue, message);
      } else if (message.guild.musicData.isPlaying == true) {
        return message.say(
          `Playlist - :musical_note:  ${playlist.title} :musical_note: has been added to queue`
        );
      }
    }

    // This if statement checks if the user entered a youtube url, it can be any kind of youtube url
    if (query.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)) {
      query = query
        .replace(/(>|<)/gi, '')
        .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
      const id = query[2].split(/[^0-9a-z_\-]/i)[0];
      const video = await youtube.getVideoByID(id).catch(function() {
        return message.say(
          'There was a problem getting the video you provided!'
        );
      });
      // // can be uncommented if you don't want the bot to play live streams
      // if (video.raw.snippet.liveBroadcastContent === 'live') {
      //   return message.say("I don't support live streams!");
      // }
      // // can be uncommented if you don't want the bot to play videos longer than 1 hour
      // if (video.duration.hours !== 0) {
      //   return message.say('I cannot play videos longer than 1 hour');
      // }
      // // can be uncommented if you want to limit the queue
      // if (message.guild.musicData.queue.length > 10) {
      //   return message.say(
      //     'There are too many songs in the queue already, skip or wait a bit'
      //   );
      // }
      message.guild.musicData.queue.push(
        PlayCommand.constructSongObj(video, voiceChannel)
      );
      if (
        message.guild.musicData.isPlaying == false ||
        typeof message.guild.musicData.isPlaying == 'undefined'
      ) {
        message.guild.musicData.isPlaying = true;
        return PlayCommand.playSong(message.guild.musicData.queue, message);
      } else if (message.guild.musicData.isPlaying == true) {
        let qqe = new MessageEmbed()
          .setTitle('✅ Success')
          .setDescription(`${video.title} added to queue`)   
        return message.say(qqe);
      }
    }

    // if user provided a song/video name
    const videos = await youtube.searchVideos(query, 5).catch(function() {
      return message.say(
        'There was a problem searching the video you requested :('
      );
    });
    if (videos.length < 5) {
      return message.say(
        `I had some trouble finding what you were looking for, please try again or be more specific`
      );
    }
    const vidNameArr = [];
    for (let i = 0; i < videos.length; i++) {
      vidNameArr.push(`${i + 1}: ${videos[i].title}`);
    }
    vidNameArr.push('exit');
    const picta = 'https://i.pinimg.com/originals/07/1a/6d/071a6db29f2b971a48f5ca483632e5b4.gif';
    const embed = new MessageEmbed()
      .setColor('#cce7e8')
      .setAuthor('Choose a song by commenting a number between 1 and 5', picta)
      .setFooter(`Req by : ${message.author.tag}`)
      .setTimestamp()
      .addField('Song 1', vidNameArr[0])
      .addField('Song 2', vidNameArr[1])
      .addField('Song 3', vidNameArr[2])
      .addField('Song 4', vidNameArr[3])
      .addField('Song 5', vidNameArr[4])
      .addField('Exit', 'exit');
    var songEmbed = await message.channel.send({ embed });
    message.channel
      .awaitMessages(
        function(msg) {
          return (msg.content > 0 && msg.content < 6) || msg.content === 'exit';
         
        },
        {
          max: 1,
          time: 60000,
          errors: ['time']
        }
      )
    
      .then(function(response) {
        const videoIndex = parseInt(response.first().content);
        if (response.first().content === 'exit') return songEmbed.delete();
        youtube
          .getVideoByID(videos[videoIndex - 1].id)
          .then(function(video) {
            // // can be uncommented if you don't want the bot to play live streams
            // if (video.raw.snippet.liveBroadcastContent === 'live') {
            //   songEmbed.delete();
            //   return message.say("I don't support live streams!");
            // }

            // // can be uncommented if you don't want the bot to play videos longer than 1 hour
            // if (video.duration.hours !== 0) {
            //   songEmbed.delete();
            //   return message.say('I cannot play videos longer than 1 hour');
            // }

            // // can be uncommented if you don't want to limit the queue
            // if (message.guild.musicData.queue.length > 10) {
            //   songEmbed.delete();
            //   return message.say(
            //     'There are too many songs in the queue already, skip or wait a bit'
            //   );
            // }
            message.guild.musicData.queue.push(
              PlayCommand.constructSongObj(video, voiceChannel)
            );
            if (message.guild.musicData.isPlaying == false) {
              message.guild.musicData.isPlaying = true;
              if (songEmbed) {
                songEmbed.delete();
              }
              PlayCommand.playSong(message.guild.musicData.queue, message);
            } else if (message.guild.musicData.isPlaying == true) {
              if (songEmbed) {
                songEmbed.delete();
              }
              let qqew = new MessageEmbed()
              .setTitle('✅ | Success')
              .setDescription(`${video.title} added to queue`)   
            message.say(qqew);
            }
          })
          .catch(function() {
            if (songEmbed) {
              songEmbed.delete();
            }
            return message.say(
              'An error has occured when trying to get the video ID from youtube'
            );
          });
      })
      .catch(function() {
        if (songEmbed) {
          songEmbed.delete();
        }
        return message.say(
          'Please try again and enter a number between 1 and 5 or exit'
        );
      });
  }
  static playSong(queue, message) {
    const classThis = this; // use classThis instead of 'this' because of lexical scope below
    queue[0].voiceChannel
      .join()
      .then(function(connection) {
        const dispatcher = connection
          .play(
            ytdl(queue[0].url, {
              quality: 'highestaudio',
              highWaterMark: 1024 * 1024 * 10
            })
          )
          .on('start', function() {
            message.guild.musicData.songDispatcher = dispatcher;
            dispatcher.setVolume(message.guild.musicData.volume);
            const videoEmbed = new MessageEmbed()
              .setTitle('Playing 🎶')
              .setImage(queue[0].thumbnail)
              .setColor('#cce7e8')
              .addField('Playing:', `${queue[0].title} \[${queue[0].duration}\]`)
              .setTimestamp()
              .setFooter(`Req by : ${message.author.username}`)
              if (queue[1]) videoEmbed.addField('Next Song:', queue[1].title);
              message.say(videoEmbed).then(msg => {
                msg.react("▶").then( r => {
                msg.react("⏸")
                msg.react("⏹")
                msg.react("❌")
                var backwardsFilter = (reaction, user) => reaction.emoji.name === "▶" && user.id === message.author.id;
                var fowardsFilter = (reaction, user) => reaction.emoji.name === "⏸" && user.id === message.author.id;
                var stopFilter = (reaction, user) => reaction.emoji.name === "⏹" && user.id === message.author.id;
                var nextFilter = (reaction, user) => reaction.emoji.name === "❌" && user.id === message.author.id;
                var backwards = msg.createReactionCollector(backwardsFilter);
                var fowards = msg.createReactionCollector(fowardsFilter);
                var stop = msg.createReactionCollector(stopFilter);
                var next = msg.createReactionCollector(nextFilter)
                backwards.on("collect", r => {
                message.guild.musicData.songDispatcher.resume();
                msg.reactions.resolve("▶").users.remove(message.author.id)
                message.channel.send("▶ Resumed").then(async message => {
                message.delete({ timeout: 2000 });
              })
            })

        fowards.on("collect", r => {
              message.guild.musicData.songDispatcher.pause();
            msg.reactions.resolve("⏸").users.remove(message.author.id)
            message.channel.send("⏸ Song Paused").then(async message => {
            message.delete({ timeout: 2000 });
            })
        })
        stop.on("collect", r => {
            message.guild.musicData.songDispatcher.end();
            msg.reactions.resolve("⏹").users.remove(message.author.id)
            message.channel.send("⏹ Song Stopped").then(async message => {
            message.delete({ timeout: 2000 });
            })
        })
        next.on("collect", r => {
          message.guild.musicData.songDispatcher.end();
          message.guild.musicData.queue.length = 0;
          msg.reactions.resolve("❌").users.remove(message.author.id)
          message.channel.send("❌ Im leaving").then(async message => {
          message.delete({ timeout: 2000 });
          })
      })
        })

        })
            message.guild.musicData.nowPlaying = queue[0];
            return queue.shift();
        
          })
          .on('finish', function() {
            if (queue.length >= 1) {
              return classThis.playSong(queue, message);
            } else {
              let embods = new MessageEmbed()
              .setTitle('✅ Horrayy!')
              .setDescription('✔ | Im leaving, because the song has ended :)')
             message.say(embods);
              message.guild.musicData.isPlaying = false;
              message.guild.musicData.nowPlaying = null;
              message.guild.musicData.songDispatcher = null;
              return message.guild.me.voice.channel.leave();
        
            }
          })
          .on('error', function(e) {
            message.say('Cannot play song');
            console.error(e);
            message.guild.musicData.queue.length = 0;
            message.guild.musicData.isPlaying = false;
            message.guild.musicData.nowPlaying = null;
            message.guild.musicData.songDispatcher = null;
            return message.guild.me.voice.channel.leave();
          });
      })
      .catch(function(e) {
        console.error(e);
        return message.guild.me.voice.channel.leave();
      });
  }
  static constructSongObj(video, voiceChannel) {
    let duration = this.formatDuration(video.duration);
    if (duration == '00:00') duration = 'Live Stream';
    return {
      url: `https://www.youtube.com/watch?v=${video.raw.id}`,
      title: video.title,
      rawDuration: video.duration,
      duration,
      thumbnail: video.thumbnails.high.url,
      voiceChannel
    };
  }
  // prettier-ignore
  static formatDuration(durationObj) {
    const duration = `${durationObj.hours ? (durationObj.hours + ':') : ''}${
      durationObj.minutes ? durationObj.minutes : '00'
    }:${
      (durationObj.seconds < 10)
        ? ('0' + durationObj.seconds)
        : (durationObj.seconds
        ? durationObj.seconds
        : '00')
    }`;
    return duration;
  }
};
