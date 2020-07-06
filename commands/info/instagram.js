const Command = require('../../structures/Command');
const { MersenneTwister19937, integer } = require('random-js');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { MessageEmbed } = require('discord.js');
const fetch = require("node-fetch");
const percentColors = [
	{ pct: 0.0, color: { r: 0, g: 0, b: 255 } },
	{ pct: 0.5, color: { r: 12, g: 222 / 2, b: 255 / 2 } },
	{ pct: 1.0, color: { r: 1, g: 215, b: 0 } }
];

module.exports = class FriendshipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'instagram',
			aliases: ['ig'],
			group: 'info',
			memberName: 'osup',
			description: 'Show instagram user stats',
      			hidden: true,
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
      			args: [
				{
					key: 'user',
					prompt: 'Just Type Username that you want to show information?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { user }) {
      	msg.delete();
        const name = user;
        const url = `https://instagram.com/${name}/?__a=1`;
        
        let res; 
        try {
            res = await fetch(url).then(url => url.json());
        } catch (err) {
            return msg.reply(`Instagram username isnt exist`);
        }
    	try {
    	const account = res.graphql.user; 
    
    	const tunggu = await msg.say('<a:load:712947992881266719> Generating').then(async message => {
      		message.delete({ timeout: 4000 });
		});
      
    	let link = await msg.say(`Link : **https://instagram.com/${name}**`);
		const firstAvatarURL = account.profile_pic_url_hd;
		try {
      			const bg = await loadImage('https://i.pinimg.com/originals/ff/ec/25/ffec25f9ad8b4ecc27033989b81a700f.jpg')
      			const firstAvatarData = await request.get(firstAvatarURL);
			const firstAvatar = await loadImage(firstAvatarData.body);
			const base = await loadImage('https://cdn.discordapp.com/attachments/688763072864976906/712898381386743868/IG_BOT_DISCORD_low.png');
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(bg, 0, 0, 1280, 1080);
      			ctx.drawImage(base, 0, 0, 1280, 1080);
      			ctx.textAlign = 'left'; //text
			ctx.fillStyle = 'white';
			ctx.font = '40px Calibri';
      			ctx.fillText(account.full_name, 120, 290); //username 
      			ctx.fillText(account.edge_owner_to_timeline_media.count, 600, 500); //post
      			ctx.fillText(account.edge_followed_by.count, 790, 500); //followers
      			ctx.fillText(account.edge_follow.count, 1060, 500); //following
      			ctx.fillText(account.biography.length == 0 ? "Description Not set" : account.biography, 120, 800); //bioo
	    		ctx.beginPath();     //bunder
      			ctx.arc(310, 540, 200, 0, 2 * Math.PI); 
	    		ctx.closePath();
	    		ctx.clip();
      			ctx.drawImage(firstAvatar, 110, 340, 400, 400)
			return await msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'ig.png' }] });
		} catch (err) {
			return msg.reply(`Oh no\`. Try again later!`);
		}
    	} catch (err) {
			return msg.reply(`Oh no, error in\`user\`, Please Make sure that's username is correct\nIf still continues that's means ig command being rate limit`);
  }
  }
};
