// DEPRECATED

// const Command = require('../../structures/Command');
// const { createCanvas, loadImage } = require('canvas');
// const request = require('node-superfetch');
// const fetch = require('node-fetch');

// module.exports = class instagramCommand extends Command {
//     constructor(client) {
//         super(client, {
//             name: 'instagram',
//             aliases: ['ig'],
//             group: 'info',
//             memberName: 'osup',
//             description: 'Show instagram user stats',
//             hidden: true,
//             throttling: {
//                 usages: 1,
//                 duration: 10,
//             },
//             clientPermissions: ['ATTACH_FILES'],
//             args: [
//                 {
//                     key: 'user',
//                     prompt: 'Just Type Username that you want to show information?',
//                     type: 'string',
//                 },
//             ],
//         });
//     }

//     async run(msg, { user }) {
//         const name = user;
//         const url = `https://apis.duncte123.me/insta/${name}/?__a=1`;
        
//         let res; 
//         try {
//             res = await fetch(url).then(url => url.json());
//         }
//         catch (err) {
//             return msg.reply('Instagram username isnt exist');
//         }
//         try {
//             const account = res.user; 
//             const firstAvatarURL = account.profile_pic_url;
//             try {
//                 const bg = await loadImage('https://images4.alphacoders.com/909/thumb-1920-909912.png');
//                 const firstAvatarData = await request.get(firstAvatarURL);
//                 const firstAvatar = await loadImage(firstAvatarData.body);
//                 const base = await loadImage('https://cdn.discordapp.com/attachments/688763072864976906/712898381386743868/IG_BOT_DISCORD_low.png');
//                 const canvas = createCanvas(base.width, base.height);
//                 const ctx = canvas.getContext('2d');
//                 ctx.drawImage(bg, 0, 0, 1280, 1080);
//                 ctx.drawImage(base, 0, 0, 1280, 1080);
//                 ctx.textAlign = 'left'; //text
//                 ctx.fillStyle = 'white';
//                 ctx.font = '40px Calibri';
//                 ctx.fillText(account.full_name, 120, 290); //username 
//                 ctx.fillText(account.uploads.count, 600, 500); //post
//                 ctx.fillText(account.followers.count, 790, 500); //followers
//                 ctx.fillText(account.following.count, 1060, 500); //following
//                 ctx.fillText(account.biography.length == 0 ? 'Description Not set' : account.biography, 120, 800); //bioo
//                 ctx.beginPath();     //bunder
//                 ctx.arc(310, 540, 200, 0, 2 * Math.PI); 
//                 ctx.closePath();
//                 ctx.clip();
//                 ctx.drawImage(firstAvatar, 110, 340, 400, 400);
//                 return await msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'ig.png' }] });
//             }
//             catch (err) {
//                 console.log(err);
//                 return msg.reply('Oh no. Try again later!');
//             }
//         }
//         catch (err) {
//             return msg.reply('Oh no, error in`user`, Please Make sure that\'s username is correct\nIf still continues that\'s means ig command being rate limit');
//         }
//     }
// };
