module.exports = {
	name: 'ping',
	alias: [],
	description: 'Ping!',
	execute(message, args) {
		const timeTaken = Date.now() - message.createdTimestamp;
		message.channel.send(`Pong. This message had a latency of ${timeTaken}ms`);
	},
};