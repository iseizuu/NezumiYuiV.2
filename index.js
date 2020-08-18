require('dotenv').config();
const path = require('path');
const { formatNumber } = require('./util/Util');
const { MessageEmbed } = require("discord.js");
const { Structures } = require('discord.js');
const { prefix } = require('./config.json');
const http = require('http');
const express = require('express');
const app = express();
const { PREFIX, INVITE } = process.env;
const Client = require('./structures/Client');

Structures.extend('Guild', Guild => {
  class MusicGuild extends Guild {
    constructor(client, data) {
      super(client, data);
      this.musicData = {
        queue: [],
        isPlaying: false,
        nowPlaying: null,
        songDispatcher: null,
        volume: 1
      };
      this.triviaData = {
        isTriviaRunning: false,
        wasTriviaEndCalled: false,
        triviaQueue: [],
        triviaScore: new Map()
      };
    }
  }
  return MusicGuild;
});
const client = new Client({
	commandPrefix: PREFIX,
	owner: '271576733168173057',
	invite: INVITE,
	disableMentions: 'everyone',
	disabledEvents: ['TYPING_START']
});


client.registry
	.registerDefaultTypes()
	.registerTypesIn(path.join(__dirname, 'types'))
	.registerGroups([
		['util', 'Utility'],
    		['music', 'Music'],
		['info', 'Info'],
		['fun', 'Fun'],
		['games', 'Games'],
    		['own', 'Owner']
	])
	.registerDefaultCommands({
		help: false,
		ping: false,
		prefix: false,
		commandState: false,
		eval: true,
		unknownCommand: false
	})
  .registerCommandsIn(path.join(__dirname, 'commands'));

  client.on('ready', () => {
	client.logger.info(`[READY] Logged in as ${client.user.tag}! ID: ${client.user.id}`);

});

//Listener Event: Bot Launched
client.on("ready", async () =>{
  console.log(`${client.user.username} Ready to fight`);
  setInterval(async () => {
    let ran = [`nez. | ${formatNumber(client.users.cache.size)} Users`, `Found Bug? | ${PREFIX}report`];
    client.user.setPresence({
      activity: {
        name: dom,
        type: "WATCHING",
        url: "https://www.twitch.tv/a"
      },
      status: "dnd"
    });
  }, 5000) // millsecond
});


client.on("guildCreate", guild => {
  client.channels.cache.get("718436188100362280").send(`Nezumi : [💖] New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});
client.on("guildDelete", guild => {
  client.channels.cache.get("718436188100362280").send(`Nezumi : [💔] I have been removed from: ${guild.name} (id: ${guild.id}) with ${guild.memberCount}`);
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`); 


});

client.on('disconnect', event => {
	client.logger.error(`[DISCONNECT] Disconnected with code ${event.code}.`);
	process.exit(0);
});

client.on('error', err => client.logger.error(err));
client.on('warn', warn => client.logger.warn(warn));
client.on('commandError', (command, err) => client.logger.error(`[COMMAND:${command.name}]\n${err.stack}`));
client.on('commandRun', (command, promise, message, args, fromPattern, result) => {
	if(client.isOwner(message.author)) return true;
	console.log(`[INFO]: ${message.author.tag} runned ${command.name} command!`);
});


//tag event

client.on('message', async message => {
   let embed = new MessageEmbed()
    .setColor('#cce7e8')
    .setDescription(`Hello **${message.author.tag}**, My prefix **\`${prefix}\`** || Or ${prefix}help  🎉🥳`)
    if (message.content === `<@!${client.user.id}>` || message.content === `<@${client.user.id}>`)
    return message.channel.send(embed);

});
var server = require('http').createServer(app);
app.get("/", (request, response) => {
  console.log("Ping Received");
  response.sendStatus(200);
});
const listener = server.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.herokuapp.com`);
}, 280000);


const DBL = require('dblapi.js');
const dbl = new DBL(process.env.TOP_GG_TOKEN, { webhookServer: listener, webhookAuth: process.env.AUTH }, client);

dbl.webhook.on('ready', hook => {
  console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
});

dbl.on('posted', () => {
  console.log(`Server count posted! Now ${client.guilds.cache.size}`);
//  client.channels.cache.get("718436188100362280").send(`:inbox_tray: [DBL] Client ready in ${client.guilds.cache.size} Guilds`);//686915490454831138
});
dbl.webhook.on('vote', vote => {
  console.log(`User with ID ${vote.user} just voted!`);
   client.channels.cache.get("716829755650998434").send(`:inbox_tray: [DBL] User with ID ${vote.user} just voted!`);
});



client.login(process.env.TOKEN);
