const { Command } = require('discord.js-commando');
const { exec } = require('child_process');

module.exports = class ExCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'execute',
            aliases: ['ex', 'exec', 'sh'],
            group: 'own',
            memberName: 'execute',
            description: 'Ex',
            guarded: true,
            ownerOnly: true,
            hidden: true,
             args: [
                {
                    key: 'input',
                    prompt: 'wut?',
                    type: 'string',
                },
            ],
        });
    }
    async run(msg, { input }) {
        const a = Date.now();
        exec(input, async (error, stdout, stderr) => {
            if (error) {
                return msg.say(`\`\`\`bash\n${await this.hastePost(error)}\`\`\``);
            }
            try {
                if(stdout.length > 2000) {
                    return msg.say(`**ERROR** ⏰: ${Date.now() - a}ms\n\`\`\`bash\nSucces But Returned no Output
                    ${await this.hastePost(stdout)}\`\`\``);
                }
                console.log(stdout);
                msg.say(`**STDOUT** ⏰: ${Date.now() - a}ms\n\`\`\`bash\n${stdout}\`\`\``);

            }
            catch {
                if(stderr.length > 2000) {
                    return msg.say(`\`\`\`bash\n${await this.hastePost(stderr)}\`\`\``);
                }
                console.log(stderr);
                msg.say(`**STDERR** ⏰: ${Date.now() - a}ms\n\`\`\`bash\n${stderr}\`\`\``);
            }
        });
    }
    async hastePost(code) {
        const { body } = await this.client.fetch
        .post('https://hasteb.in/documents')
        .send(code);
        return `https://hasteb.in/${body.key}`;
    }
};
