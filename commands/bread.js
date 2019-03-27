module.exports = {
	name: 'bread',
	description: 'i want to eat bread',
	execute(message, args) {
        message.channel.send({file: "https://i.redd.it/ozramu3wu9y11.png"});
	},
};