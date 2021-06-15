const Discord = require('discord.js');
const config = require('./config.json');
const bot_config = require('./bot-config.json');
const fs = require('fs');


// Setup
const client = new Discord.Client();
const prefix = bot_config.prefix;
const channelID = '477172511424118804';
client.login(config.BOT_TOKEN);
client.on('ready', () => {
	console.log('I am ready!');
	client.channels.fetch(channelID)
		.then(channel => {
			channel.send('test');
		})
		.catch(console.error);
});

client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}
console.log(client.commands);

client.on('message', message => {
	const channelIDs = bot_config.Channel_IDS;
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	if (!channelIDs.includes(message.channel.id)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.alias && cmd.alias.includes(commandName));
	if(!command)return;
	if (command.args && !args.length) {
		let reply = (`You didn't provide any arguments, ${message.author}!`);
		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}
		message.channel.send(reply);
	}
	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that commandName!');
	}
});
