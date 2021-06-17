const Discord = require('discord.js');
const { prefix } = require('../../../../bot-config.json');

module.exports = {
	name: 'list',
	alias: ['help'],
	description: 'wyświetl tą listę',
	lvl: -1,
	execute(message, args, commands) {
		console.log(commands);
		const embed = new Discord.MessageEmbed().setTitle('Pomoc dla polecenia config').setColor('GREY');
		if (!args.length) {
			commands.map(cmd => {
				console.log(cmd.alias);
				embed.addField(`Polecenie:\t**${cmd.name}**`, cmd.alias, true);
				embed.addField('\u200b', '\u200b', true);
				embed.addField('Użycie', cmd.usage, true);

			});
		}
		else {
			embed.setTitle(`Pomoc dla polecenia ${args[0]}`);
			const data = [];
			const name = args[0].toLowerCase();
			const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
			if (!command) {
				return message.reply('that\'s not a valid command!');
			}
			data.push({ name: '**Nazwa**', value: command.name });
			if (command.aliases) data.push({ name: '**Aliasy:**', value: command.aliases.join(', ') });
			if (command.description) data.push({ name: '**Opis:**', value: command.description });
			if (command.usage) data.push({ name: '**Użycie:**', value: `\`${prefix}${command.name}${command.usage}\`` });

			embed.addFields(data);
		}
		message.channel.send(embed);
	},
};