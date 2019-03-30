'use strict';

const request = require('request-promise-native');

module.exports = async (messageService, args, config) => {
	try {
		// get fox with promise
		const fox = await request.get({
			url: 'https://randomfox.ca/floof/',
			headers: { 'Content-Type': 'application/json' },
			// retrieve as json
			json: true,
        });
		// send fox in embed
		messageService.channel.send({
			files: [{ 
				attachment: fox.image,
			}],
		});
	// catch error
	} catch (err) { console.error(err); }
}