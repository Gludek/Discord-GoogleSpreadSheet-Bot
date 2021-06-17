const config = require('../../../../bot-config.json');
const Discord = require('discord.js');
module.exports = {
	name: 'list',
	alias: [],
	description: 'add channel',
	lvl: -1,
	execute(message, args) {
		const data = config.Channel_IDS;
		console.log(data);
		const kanały = [];
		data.forEach(element => {
			const kanał = {};
			console.log(element);
			const nazwa = message.guild.channels.cache.get(element).name;
			kanał['name'] = nazwa;
			kanał['value'] = element;
			kanały.push(kanał);
		});
		console.log(kanały);
		const embed = new Discord.MessageEmbed().setTitle('Obsługiwane kanały').addFields(kanały).setTimestamp().setColor('GREEN');
		message.channel.send(embed);
	},
};