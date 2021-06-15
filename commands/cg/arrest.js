const { x } = require('../../google');
const config = require('../../bot-config.json');
const Discord = require('discord.js');
const oddzialy = config.oddzialy;
module.exports = {
	name: 'arrest',
	alias: ['a', 'areszt'],
	description: 'Ping!',
	args: true,
	usage: 'pełen komunikat z czatu, np.`[KOMUNIKATOR] CG TRP 1234 BOT: Aresztowano CG TRP 4321 KTOS | art. 1 § 2 | 5h | 23:05`, może być bez [KOMUNIKATOR]',
	execute(message, args) {
		args = args.toString().replace(/,/g, ' ').split('|');
		let string = '';
		let oddzial = '';
		let cg = -1, art = -1, cz = -1, wj = -1;
		let aresztowany = '', acg = '', artykuly = '', czas = '', wyjscie = '';
		args.forEach(element => {
			string = element.replace(/\[.*?[A-Za-z]*.*?\]/g, '').trim();
			if (cg > -1 || oddzialy.includes(string.substring(0, 3).trim().toLowerCase())) {
				if (wj == -1 && cg == 0 && art == 0 && cz == 0) {
					wyjscie = string;
					wj = 0;
				}
				if (cz == -1 && cg == 0 && art == 0) {
					czas = string.replace(/(?=h)/gi, ' ');
					cz = 0;
				}
				if (art == -1 && cg == 0) {
					artykuly = string;
					art = 0;
				}
				if (cg == -1) {
					aresztowany = string.replace(/.*:\sareszt.*?\s/gi, '');
					acg = string.replace(/:\s.*/g, '');

					cg = 0;
				}

			}
		});
		aresztowany = aresztowany.trim();
		acg = acg.trim();
		artykuly = artykuly.trim().replace(/(")|(.{4}\|)/gm, '');
		czas = czas.trim().replace(/\|/g, '');
		wyjscie = wyjscie.trim();
		oddzial = aresztowany.trim().split(' ').shift();
		message.delete();
		const dane = {
			cg: acg,
			ar: aresztowany,
			art: artykuly,
			cz: czas,
			wj: wyjscie,
			oddzial: oddzial,
		};
		x(dane);
		const embed = new Discord.MessageEmbed()
			.setTitle('    ---Nowy areszt---')
			.addFields(
				{ name: 'Aresztowany:', value: aresztowany },
				{ name: 'Złamane artykuły:', value: artykuly },
				{ name: 'Długość aresztu:', value: czas },
				{ name: 'Czas wyjścia z aresztu:', value: wyjscie },
			)
			.setTimestamp()
			.setFooter(`Areszt wykonał: ${acg}`)
			.setColor(parseInt('FF0000', 16));
		message.channel.send(embed);
	},
};