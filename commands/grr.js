module.exports = {
	name: 'grr',
	description: 'jess-grr',
	execute(message, args) {
			message.channel.send({attachment: "../assets/jess-grr.mp3",
				name:"grr.mp3"});
	},
};