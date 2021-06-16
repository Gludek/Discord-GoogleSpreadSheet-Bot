const config = require('../../bot-config.json');
const fs = require('fs');
module.exports = {
	name: 'config',
	alias: [],
	description: 'Wszystko związane z setupem!',
	args: true,
	lvl:-1,
	usage: 'list` lub `!config <sekcja>',
	execute(message, args) {
		const object = config;
		switch (args[0]) {
		case 'channels':
			switch (args[1]) {
			case 'dodaj':
			case 'add': {
				object.Channel_IDS.push(args[2]);
				const data = JSON.stringify(object);
				fs.writeFile('./bot-config.json', data, function(err) {
					if (err) {
						console.log('Wystąpił błąd przy zmienianiu ustawień.');
						console.log(err.message);
						return;
					}
					console.log('Pomyślnie zmieniono ustawienia.');
				});
			}
				break;
			case 'usuń':
			case 'remove': {
				const array = object.Channel_IDS;
				if (array.length <= 1) {
					message.reply('Nie można usunąć ostatniego kanału!!');
					break;
				}
				for (let i = 0; i < array.length; i++) {
					console.log(array[i]);
					console.log(i);
					if (array[i] === args[2]) {
						array.splice(i, 1);
						i--;
						break;
					}
				}
				console.log(array);
				object.Channel_IDS = array;
				const data = JSON.stringify(object);
				fs.writeFile('./bot-config.json', data, function(err) {
					if (err) {
						console.log('Wystąpił błąd przy zmienianiu ustawień.');
						console.log(err.message);
						return;
					}
					console.log('Pomyślnie zmieniono ustawienia.');
				});
			}
				break;
			default:
				message.reply('Dostępne opcje:\n```\nadd {channel ID}\nremove {channel ID}\nlist```');
			}
			break;
		default:
			message.reply('Dostępne opcje:\n```channels```');
		}
	},
};