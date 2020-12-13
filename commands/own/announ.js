const Command = require('../../structures/Command');

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'announ',
            aliases: ['as', 'adminsay'],
            group: 'own',
            memberName: 'say',
            description: 'DEV ONLY',
            hidden: true,
            ownerOnly: true,
            args: [
                {
                    key: 'text',
                    prompt: 'What text would you like me to say?',
                    type: 'string',
                },
            ],
        });
    }

    async run(msg, { text }) {
        try {
            if (msg.guild && msg.deletable) await msg.delete();
            return msg.say(text);
        }
        catch {
            return msg.say(text);
        }
    }
};
