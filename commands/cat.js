'use strict';

const request = require('request-promise-native');

module.exports = async (messageService, args, config) => {
	try {
		// get cat with promise
		const cat = await request.get({
			url: 'http://aws.random.cat/meow',
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
	} catch (err) { console.error(err); }
}