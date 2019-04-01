'use strict';

const request = require('request-promise-native');

module.exports = async (message, args, flags, config) => {
	try {
		// get dog with promise
		const dog = await request.get({
			url: 'https://random.dog/woof.json',
			headers: { 'Content-Type': 'application/json' },
			// retrieve as json
			json: true,
        });
		// send dog in embed
		message.channel.send({
			files: [{ 
				attachment: dog.url,
			}],
		});
	// catch error
	} catch (err) { console.error(err); }
}