const { prefix } = require('../../bot-config.json');
const fs = require('fs');
const Discord = require('discord.js');
module.exports = {
	name: 'config',
	alias: [],
	description: 'Wszystko związane z setupem!',
	args: true,
	lvl: -1,
	usage: 'list` lub `!config <sekcja>',
	execute(message, args) {
		const commandFolders = fs.readdirSync('./commands/management/commands');
		const commandSectionFolders = new Discord.Collection();
		for (const folder of commandFolders) {
			const cmds = [];
			if (folder.endsWith('.js')) {
				const command = require(`./commands/${folder}`);
				commandSectionFolders.set(command.name, command);
				console.log(commandSectionFolders);
				break;
			}
			const obj = require(`./commands/${folder}/params.json`);
			const commandFiles = fs.readdirSync(`./commands/management/commands/${folder}`).filter(file => file.endsWith('.js'));
			for (const file of commandFiles) {
				const command = require(`./commands/${folder}/${file}`);
				// console.log(command);
				cmds.push(command);
			}
			obj['commands'] = cmds;

			commandSectionFolders.set(folder, obj);
			console.log(commandSectionFolders);
		}
		const commandName = args.shift().toLowerCase();
		console.log(commandSectionFolders.get(commandName));
		const Maincommand = commandSectionFolders.get(commandName) || commandSectionFolders.find(cmd => cmd.alias && cmd.alias.includes(commandName));
		if (!Maincommand) return message.reply('Brak takiej komendy!');
		if (Maincommand.args && !args.length) {
			let reply = (`Nie podałeś odpowiedniej ilości argumentów, ${message.author}!`);
			if (Maincommand.usage) {
				reply += `\nPoprawne użycie: \`${prefix}${Maincommand.name} ${Maincommand.usage}\``;
			}
			message.channel.send(reply);
			return;
		}
		console.log(Maincommand);
		if (Maincommand.name == 'list') {
			Maincommand.execute(message, args, commandSectionFolders);
			return;
		}
		const innerCmds = new Discord.Collection();
		commandSectionFolders.map(cmd => {
			if (cmd.name != 'list') {
				cmd.commands.forEach(element => {
					innerCmds.set(element.name, element);
				});
			}
		});
		console.log(innerCmds);
		const innerCommandName = args.shift().toLowerCase();
		const innerCommand = innerCmds.get(innerCommandName) || innerCmds.find(cmd => cmd.alias && cmd.alias.includes(innerCommandName));
		if (!innerCommand) return message.reply('Brak takiej komendy!');
		if (innerCommand.args && !args.length) {
			let reply = (`Nie podałeś odpowiedniej ilości argumentów, ${message.author}!`);
			if (innerCommand.usage) {
				reply += `\nPoprawne użycie: \`${prefix}${innerCommand.name} ${innerCommand.usage}\``;
			}
			message.channel.send(reply);
			return;
		}
		try {
			innerCommand.execute(message, args);
		}
		catch (error) {
			console.error(error);
			message.reply(`Wystąpił błąd przy użyciu ${commandName}!`);
		}
	},
};