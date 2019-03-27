module.exports = {
	name: 'alpha',
	description: 'I Alpha',
	execute(message, args) {
			message.channel.send({attachment: "../assets/jess-grr.mp3",
				name:"grr.mp3"});
	},
};