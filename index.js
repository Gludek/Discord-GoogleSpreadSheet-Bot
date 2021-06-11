const Discord = require("discord.js");
const config = require("./config.json");
const fs = require("fs");

//Setup
const client = new Discord.Client();
const prefix="!"
const channelID="477172511424118804"

client.login(config.BOT_TOKEN);
array=[]
client.on('ready', () => {
    console.log('I am ready!');
    client.channels.fetch(channelID)
  .then(channel => {
      channel.send("test")
    
    console.log(channel.name+123)})
  .catch(console.error);
  });


  
// client.on("message", function(message) {
//     // console.warn(message.channel.id)
//     if (message.author.bot) return;
//     if (!message.content.startsWith(prefix)) return;
//     if (message.channel.id!=channelID) return;

//     const commandBody = message.content.slice(prefix.length);
//     const args = commandBody.split(' ');
//     const command = args.shift().toLowerCase();
//     switch(command){
//         case "ping":
//         const timeTaken = Date.now() - message.createdTimestamp;
//             message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
//         break;
//         default:
//             message.reply(`Brak polecenia ${command}!`)
//             console.log(client.channels.cache)
//     }
//   });

console.log("test")