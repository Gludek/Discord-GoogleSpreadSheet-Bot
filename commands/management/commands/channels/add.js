const config = require('../../../../bot-config.json');
const fs = require('fs');
module.exports = {
	name: 'add',
	alias: [],
	description: 'add channel',
	lvl: -1,
	execute(message, args) {
		const channelID = args[0];
		config.Channel_IDS.push(channelID);
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