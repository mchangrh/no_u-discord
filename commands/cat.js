'use strict';

const request = require('request-promise-native');

module.exports = async (message, args, flags, config) => {
	message.channel.send("retreiving cat...");
	try {
		// get cat with promise
		const cat = await request.get({
			url: 'http://aws.random.cat/meow',
			headers: { 'Content-Type': 'application/json' },
			// retrieve as json
			json: true,
        });
		// send cat in embed
		message.channel.send({
			files: [{ 
				attachment: cat.file,
			}],
		});
	// catch error
	} catch (error) {
		console.error(error);
		if (error.statusCode) {
			var errorcat = `https://http.cat/${error.statusCode}.jpg`;
			// send error code cat
			message.channel.send({
				files: [{ attachment: errorcat,	}],
			});
		}
	}
}