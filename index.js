const Discord = require('discord.js');
const bot_config = require('./config.json');
const config = require('./bot-config.json');
const fs = require('fs');
const winston = require('winston');
const prefix = config.prefix;
const logger = winston.createLogger({
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'log.log' }),
	],
	format: winston.format.printf(log => `[${log.level.toUpperCase()}] - ${log.message}`),
});
// Setup
const client = new Discord.Client();
const rangi = [];
let rangiT = [];
client.login(bot_config.BOT_TOKEN);
client.on('ready', () => {
	logger.log('info', 'The bot is online!');
	client.guilds.cache.map(guild => {
		guild.roles.cache.map(role => {
			rangi.push(role.id);
		});
	});
	rangi.push(rangi.shift());
	let i = 0;
	for (i = 0; i < rangi.length; i++) {
		rangi[i] = [rangi[i], i];
	}
	rangiT = (rangi.reverse().map(obj => {
		const rObj = {};
		rObj[obj[0]] = obj[1];
		return rObj;
	}));
});
client.on('debug', m => logger.log('debug', m));
client.on('warn', m => logger.log('warn', m));


client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands');
console.log(commandFolders);
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}
client.on('message', message => {
	const channelIDs = config.Channel_IDS;
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	if (!channelIDs.includes(message.channel.id)) return;
	logger.log('debug', client.commands);
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.alias && cmd.alias.includes(commandName));
	if (!command) return message.reply('Brak takiej komendy!');
	const member = message.member;
	let xd = 0;
	member._roles.map(role => {
		rangiT.forEach(element => {
			if (element[role] != undefined) {
				xd = (xd <= element[role]) ? (element[role]) : (xd);
			}
		});
	},
	);

	if ((command.lvl < 0 || command.lvl > xd) && message.author.id != message.guild.ownerID) return;
	if (command.args && !args.length) {
		let reply = (`Nie podałeś odpowiedniej ilości argumentów, ${message.author}!`);
		if (command.usage) {
			reply += `\nPoprawne użycie: \`${prefix}${command.name} ${command.usage}\``;
		}
		message.channel.send(reply);
		return;
	}
	try {
		console.log('1');
		if (command.name == 'help') args.push(xd);
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply(`Wystąpił błąd przy użyciu ${commandName}!`);
	}
});
