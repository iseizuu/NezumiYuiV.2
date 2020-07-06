const { CommandoClient } = require('discord.js-commando');
const DBL = require('dblapi.js');
const Collection = require('@discordjs/collection');
const winston = require('winston');
const { TOP_GG_TOKEN, BOT_LIST_GUILDS } = process.env;

module.exports = class NezClient extends CommandoClient {
	constructor(options) {
		super(options);

		this.botListGuilds = BOT_LIST_GUILDS ? BOT_LIST_GUILDS.split(',') : [];
		this.dbl = TOP_GG_TOKEN ? new DBL(TOP_GG_TOKEN, this) : null;
    		this.games = new Collection();
    		this.util = require("../util/Util.js");
		this.logger = winston.createLogger({
			transports: [new winston.transports.Console()],
			format: winston.format.combine(
				winston.format.timestamp({ format: 'MM/DD/YYYY HH:mm:ss' }),
				winston.format.printf(log => `[${log.timestamp}] [${log.level.toUpperCase()}]: ${log.message}`))
		});

	}
};
