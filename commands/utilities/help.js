const { prefix } = require('../../bot-config.json');
const Discord = require('discord.js');
module.exports = {
	name: 'help',
	description: 'Wyświetl listę wszystkich poleceń lub szczegóły konkretnego polecenia',
	aliases: ['commands', 'pomoc'],
	usage: '<nazwa polecenia',
	cooldown: 5,
	lvl: 0,
	execute(message, args) {
		const userlvl = args.pop();
		const { commands } = message.client;
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
			console.log(list);
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
	},
};