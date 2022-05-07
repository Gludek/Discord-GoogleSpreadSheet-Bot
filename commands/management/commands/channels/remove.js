const config = require('../../../../bot-config.json');
const fs = require('fs');
module.exports = {
	name: 'remove',
	alias: ['usun', 'd', 'delete'],
	description: 'remove channel',
	lvl: -1,
	execute(message, args) {
		const channelID = args[0];
		const array = config.Channel_IDS;
		if (array.length <= 1) {
			message.reply('Nie można usunąć ostatniego kanału!!');
			return;
		}
		for (let i = 0; i < array.length; i++) {
			if (array[i] === channelID) {
				array.splice(i, 1);
				i--;
				break;
			}
		}
		config.Channel_IDS = array;
		const data = JSON.stringify(config);
		fs.writeFile('./bot-config.json', data, function(err) {
			if (err) {
				console.log('Wystąpił błąd przy zmienianiu ustawień.');
				console.log(err.message);
				return;
			}
			console.log('Pomyślnie zmieniono ustawienia.');
		});
	},
};