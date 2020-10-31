const { Command } = require('discord.js-commando');

module.exports = class NezCommand extends Command {
    constructor(client, info) {
        super(client, info);
        // credit Xiao
        this.argsSingleQuotes = info.argsSingleQuotes || false;
        this.throttling = info.throttling || { usages: 1, duration: 2 };
        this.credit = info.credit || [];
        this.credit.push({
            name: 'VeguiIzumi',
            url: 'https://github.com/VeguiIzumi',
            reason: 'Code',
        });
    }
};
