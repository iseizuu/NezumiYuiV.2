const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { geniusLyricsAPI } = require('../../config.json'); //ur own apiKEY

module.exports = class LyricsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lyrics',
            aliases: ['lr'],
            memberName: 'lyrics',
            description: 'Get lyrics of any song',
            group: 'music',
            throttling: {
                usages: 1,
                duration: 5,
            },
            args: [
                {
                    key: 'songName',
                    default: '',
                    type: 'string',
                    prompt: 'What song lyrics would you like to searching?',
                },
            ],
        });
    }
    async run(message, { songName }) {
        if (
            songName == '' &&
      message.guild.musicData.isPlaying &&
      !message.guild.triviaData.isTriviaRunning
        ) {
            songName = message.guild.musicData.nowPlaying.title;
        }
        else if (songName == '' && message.guild.triviaData.isTriviaRunning) {
            return message.say('Please try again after the trivia has ended');
        }
        else if (songName == '' && !message.guild.musicData.isPlaying) {
            return message.say(
                'There is no song playing right now, please try again with a song name or play a song first'
            );
        }
        const sentMessage = await message.embed({color: '#cce7e8', description: '<a:load:712947992881266719> | Searching for the lyrics'});
        var url = `https://api.genius.com/search?q=${encodeURI(songName)}`;

        const headers = {
            Authorization: `Bearer ${geniusLyricsAPI}`,
        };
        try {
            var body = await fetch(url, { headers });
            var result = await body.json();
            const songID = result.response.hits[0].result.id;

            url = `https://api.genius.com/songs/${songID}`;
            body = await fetch(url, { headers });
            result = await body.json();

            const song = result.response.song;

            let lyrics = await getLyrics(song.url);
            lyrics = lyrics.replace(/(\[.+\])/g, '');
            let urll = song.url;
            if (lyrics.length > 4095) {
                return message.say(
                    'Lyrics are too long my embed can handle thatt');
            }
      
            if (lyrics.length < 2048) {
                const lyricsEmbed = new MessageEmbed()
                    .setAuthor('Genius', 'https://lh3.googleusercontent.com/e6-dZlTM-gJ2sFxFFs3X15O84HEv6jc9PQGgHtVTn7FP6lUXeEAkDl9v4RfVOwbSuQ')
                    .setURL(urll)
                    .setTitle(`**[ ${song.full_title} ]**`)
                    .setThumbnail(song.header_image_thumbnail_url)
                    .setColor('#cce7e8')
                    .setDescription(`${lyrics.trim()}`);
                return sentMessage.edit('', lyricsEmbed);
            }
            else {
        
                let pages = [`${lyrics.slice(0, 2048)}`, `${lyrics.slice(2048, lyrics.length)}`];  
                let page = 1; 
    
                let embed = new MessageEmbed()
                    .setAuthor('Genius', 'https://lh3.googleusercontent.com/e6-dZlTM-gJ2sFxFFs3X15O84HEv6jc9PQGgHtVTn7FP6lUXeEAkDl9v4RfVOwbSuQ')
                    .setURL(urll)
                    .setTitle(`**[ ${song.full_title} ]**`)
                    .setThumbnail(song.header_image_thumbnail_url)
                    .setColor('#cce7e8')
                    .setFooter(`Page ${page} of ${pages.length}`)
                    .setDescription(pages[page-1]);
                message.channel.send(embed).then(msg => {
                    msg.react('⬅').then( () => {
                        msg.react('➡');
			
                        const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅' && user.id === message.author.id;
                        const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡' && user.id === message.author.id;

                        const backwards = msg.createReactionCollector(backwardsFilter, {timer: 6000});
                        const forwards = msg.createReactionCollector(forwardsFilter, {timer: 6000});
 
                        backwards.on('collect', () => {
                            if (page === 1) return;
                            page--;
                            embed.setDescription(pages[page-1]);
                            embed.setFooter(`Page ${page} of ${pages.length}`);
                            msg.reactions.resolve('⬅').users.remove(message.author.id);
                            msg.edit(embed);

                        });

                        forwards.on('collect', () => {
                            if (page === pages.length) return;
                            page++;
                            embed.setDescription(pages[page-1]);
                            embed.setFooter(`Page ${page} of ${pages.length}`);
                            msg.reactions.resolve('➡').users.remove(message.author.id);
                            msg.edit(embed);
                        });
                    });
                });
                sentMessage.delete();
                return;
            }
        }
        catch (e) {
            console.error(e);
            return sentMessage.edit({embed: {color: '#cce7e8', description: 'Something when wrong, ~~i can feel it~~ , can you be more specific?'}});
        }
        async function getLyrics(url) {
            const response = await fetch(url);    	const text = await response.text();
            const $ = cheerio.load(text);
            return $('.lyrics').text().trim();
        }
    }
};
