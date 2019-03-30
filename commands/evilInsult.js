'use strict';

const request = require('request-promise-native');

module.exports = async (messageService, args, config) => {
	try {
		// get insult with promise
		const { insult } = await request.get({
			url: 'https://evilinsult.com/generate_insult.php',
			headers: { 'Content-Type': 'application/json' },
			// language english
			// retrieve as json
			qs: {
				lang: 'en',
				type: 'json',
			},
			json: true,
		});

		// send insult in embed
		messageService.channel.send({
			embed: { description: insult },
		});
	// catch error
	} catch (err) { console.error(err); }
}