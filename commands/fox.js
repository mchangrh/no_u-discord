'use strict';

const request = require('request-promise-native');

module.exports = async (message, args, flags, config) => {
	try {
		// get fox with promise
		const fox = await request.get({
			url: 'https://randomfox.ca/floof/',
			headers: { 'Content-Type': 'application/json' },
			// retrieve as json
			json: true,
        });
		// send fox in embed
		message.channel.send({
			files: [{ 
				attachment: fox.image,
			}],
		});
	// catch error
	} catch (err) { console.error(err); }
}