'use strict';

const request = require('request-promise-native');

module.exports = async (message, args, flags, config) => {
	try {
		// get shibe with promise
		const shibe = await request.get({
			url: 'http://shibe.online/api/shibes',
			headers: { 'Content-Type': 'application/json' },
			// language english
			// retrieve as json
			qs: {
				count: 1,
				urls: true,
				httpsUrls: false,
			},
			json: true,
		});

		// send insult in embed
		message.channel.send({
			files: [{ 
				attachment: shibe[0],
			}],
		});
	// catch error
	} catch (err) { console.error(err); }
}