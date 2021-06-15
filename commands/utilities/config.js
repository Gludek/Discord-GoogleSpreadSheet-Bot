const config = require('../../bot-config.json');
const fs = require('fs');
module.exports = {
	name: 'config',
	alias: [],
	description: 'Wszystko związane z setupem!',
	args: true,
	usage: 'list aby zobaczyć możliwe ustawienia',
	execute(message, args) {
		const object = config;
		switch (args[0]) {
		case 'channels':
			switch (args[1]) {
			case 'add': {
				object.Channel_IDS.push(args[2]);
				const data = JSON.stringify(object);
				fs.writeFile('./config.json', data, function(err) {
					if (err) {
						console.log('There has been an error saving your configuration data.');
						console.log(err.message);
						return;
					}
					console.log('Configuration saved successfully.');
				});
			}
				break;
			case 'remove': {
				let array = object.Channel_IDS;
				if (array.length <= 1) {
					message.reply('Nie można usunąć ostatniego kanału!!');
					break;
				}
				let index = 0;
				for (let i = 0; i < array.length; i++) {
					if (args[2] === array[i]) {
						index = 0;
						break;
					}
				}
				array = array.splice(index, 1);
				console.log(array);
				object.Channel_IDS = array;
				const data = JSON.stringify(object);
				fs.writeFile('./config.json', data, function(err) {
					if (err) {
						console.log('There has been an error saving your configuration data.');
						console.log(err.message);
						return;
					}
					console.log('Configuration saved successfully.');
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