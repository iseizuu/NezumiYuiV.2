const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { geniusLyricsAPI } = require('../../config.json');
const { formatNumber, embedURL } = require('../../util/Util');
module.exports = class LyricsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'lyrics',
      aliases: ["lr"],
      memberName: 'lyrics',
      description:'Get lyrics of any song or the lyrics of the currently playing song',
      group: 'music',
      throttling: {
        usages: 1,
        duration: 5
      },
      args: [
        {
          key: 'songName',
          default: '',
          type: 'string',
          prompt: 'What song lyrics would you like to get?'
        }
      ],
      throttling: {
				usages: 1,
				duration: 10
			}
    });
  }
  async run(message, { songName }) {
    if (
      songName == '' &&
      message.guild.musicData.isPlaying &&
      !message.guild.triviaData.isTriviaRunning
    ) {
      songName = message.guild.musicData.nowPlaying.title;
    } else if (songName == '' && message.guild.triviaData.isTriviaRunning) {
      return message.say('Please try again after the trivia has ended');
    } else if (songName == '' && !message.guild.musicData.isPlaying) {
      return message.say(
        'There is no song playing right now, please try again with a song name or play a song first'
      );
    }
    const sentMessage = await message.channel.send(
      '👀 Searching for lyrics 👀'
    );
    var url = `https://api.genius.com/search?q=${encodeURI(songName)}`;
    const headers = {
      Authorization: `Bearer ${geniusLyricsAPI}`
    };
    try {
      var body = await fetch(url, { headers });
      var result = await body.json();
      const songID = result.response.hits[0].result.id;

      // get lyrics
      url = `https://api.genius.com/songs/${songID}`;
      body = await fetch(url, { headers });
      result = await body.json();

      const song = result.response.song;

      let lyrics = await getLyrics(song.url);
      lyrics = lyrics.replace(/(\[.+\])/g, '');
      let urll = song.url;
      if (lyrics.length > 4095)
        return message.say('Lyrics are too long to be returned as embed');
      if (lyrics.length < 2048) {
        const lyricsEmbed = new MessageEmbed()
          .setAuthor('Genius', 'https://lh3.googleusercontent.com/e6-dZlTM-gJ2sFxFFs3X15O84HEv6jc9PQGgHtVTn7FP6lUXeEAkDl9v4RfVOwbSuQ')
          .setURL(urll)
          .setTitle(`**[ ${song.full_title} ]**`)
          .setThumbnail(song.header_image_thumbnail_url)
          .setColor('#cce7e8')
          .setDescription(`${lyrics.trim()} \n\n(\_Source\_ : ${urll})`);
        return sentMessage.edit('', lyricsEmbed);
      } else {
        // lyrics.length > 2048
        const firstLyricsEmbed = new MessageEmbed()
          .setAuthor('Genius', 'https://lh3.googleusercontent.com/e6-dZlTM-gJ2sFxFFs3X15O84HEv6jc9PQGgHtVTn7FP6lUXeEAkDl9v4RfVOwbSuQ')
          .setURL(urll)
          .setTitle(`**[ ${song.full_title} ]**`)
          .setThumbnail(song.header_image_thumbnail_url)
          .setColor('#cce7e8')
          .setDescription(lyrics.slice(0, 2048));
          const secondLyricsEmbed = new MessageEmbed()
          .setColor('#cce7e8')
          .setDescription(lyrics.slice(2048, lyrics.length));
        sentMessage.edit('', firstLyricsEmbed);
        message.channel.send(secondLyricsEmbed);
        return;
      }
    } catch (e) {
      console.error(e);
      return sentMessage.edit(
        'Something when wrong, please try again or be more specific (or just type manually)'
      );
    }
    async function getLyrics(url) {
      const response = await fetch(url);
      const text = await response.text();
      const $ = cheerio.load(text);
      return $('.lyrics')
        .text()
        .trim();
    }
  }
};