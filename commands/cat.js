'use strict';

const request = require('request-promise-native');

module.exports = async (messageService, args, config) => {
	messageService.channel.send("retreiving cat...");
	try {
		// get cat with promise
		const cat = await request.get({
			url: 'http://aws.rndom.cat/meow',
			headers: { 'Content-Type': 'application/json' },
			// retrieve as json
			json: true,
        });
		// send cat in embed
		messageService.channel.send({
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
			messageService.channel.send({
				files: [{ attachment: errorcat,	}],
			});
		}
	}
}