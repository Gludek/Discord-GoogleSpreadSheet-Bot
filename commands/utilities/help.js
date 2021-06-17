const { prefix } = require('../../bot-config.json');
const Discord = require('discord.js');
module.exports = {
	name: 'help',
	description: 'Wyświetl listę wszystkich poleceń lub szczegóły konkretnego polecenia',
	aliases: ['commands', 'pomoc'],
	usage: `\`\n\`${prefix}help <nazwa polecenia>`,
	cooldown: 5,
	lvl: 0,
	execute(message, args) {
		const userlvl = args.pop();
		const { commands } = message.client;
		if (args[0] == 'MakeDBGreatAgain') {
			const embed = new Discord.MessageEmbed().setTitle('Personalia członka Departamentu Bezpieczeństwa').setColor('PURPLE');
			embed.addFields(
				{ name: 'Imię:', value: 'Jestur', inline: true },
				{ name: 'Nazwisko:', value: 'Heakel', inline: true },
				{ name: 'Ranga:', value: 'Dyrektor' },
				{ name: 'Lubi:', value: 'Niszyczyć idiotów argumentacją' },
				{ name: 'Ostatnio widziany:', value: 'W dobrych czasach' },
			);
			message.author.send(embed);
			return;
		}
		const embed = new Discord.MessageEmbed().setTitle('Command List').setTimestamp().setColor('RANDOM');
		if (!args.length) {
			const list = (commands.map(obj => {
				if ((obj.lvl < 0 || obj.lvl > userlvl) && message.author.id != message.guild.ownerID) return '';
				const rObj = {};
				rObj['name'] = prefix + obj.name;
				rObj['value'] = obj.description;
				rObj['inline'] = false;
				return rObj;
			}));
			for (let i = 0; i < list.length; i++) {
				console.log(list[i]);
				if (list[i] == '') {
					list.splice(i, 1);
					i--;
				}
			}
			embed.addFields(list);
			return message.author.send(embed)
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('Wysłałem wiadomość prywatną!');
				})
				.catch(error => {
					console.error(`Nie mozna wysłać wiadomośc prywatnej do ${message.author.tag}.\n`, error);
					message.reply('Nie mogę do wysłać do ciebie wiadomości, może masz zablokowane?');
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
			return message.author.send(embed);
		}
	},
};