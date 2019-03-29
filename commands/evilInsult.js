'use strict';

const request = require('request-promise-native');

module.exports = async (messageService, args, config) => {
	try {
		const { insult } = await request.get({
			url: 'https://evilinsult.com/generate_insult.php',
			headers: {
				'Content-Type': 'application/json'
			},
			qs: {
				lang: 'en',
				type: 'json',
			},
			json: true,
		});

		messageService.channel.send({
			embed: { description: insult },
		});
	} catch (err) {
		console.error(err);
	}
}