module.exports = async (message, args, flags, config) => {
	// start cleaning
	message.channel.send('start clean');
	try {
		// fetch messages
		const messages = await message.channel.fetchMessages();

		// filter messages
		const botRelatedMessages = messages.filter((msg) => {
			const isCommand = msg.content.startsWith('!') || msg.content.startsWith(config.prefix);
			return msg.author.bot || isCommand;
		});

		// delete messages
		const deletedMessages = await message.channel.bulkDelete(botRelatedMessages);
		const toDelete = await message.channel.send(`Bulk deleted ${deletedMessages.size} messages`);
		toDelete.delete(config.autoDeleteDelay);
	} catch (err) {
		console.error(err);
	}
}
