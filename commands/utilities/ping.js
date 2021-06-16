module.exports = {
	name: 'ping',
	alias: [],
	description: 'Ping!',
	lvl:-1,
	execute(message, args) {
		// console.log(message);
		const timeTaken = Date.now() - message.createdTimestamp;
		message.channel.send(`Pong. This message had a latency of ${timeTaken}ms`);
	},
};