const config = require("../config.json");

module.exports = {
	name: 'clean',
	description: 'cleans channel',
	execute(message, args) {
        // start cleaning
        message.channel.send('start clean')
        // fetch messages
        const allMessages = message.channel.fetchMessages()
            // collect and filter through delOrNot
            .then(messages => { return messages.filter(msg => delOrNot(msg)) } )
            .then(collect => bulkDel(collect, message))
            .catch(console.error);

        function bulkDel(botMessages, message) {
            // lol just delete
            message.channel.bulkDelete(botMessages)
                .then(messages => message.channel.send(`Bulk deleted ${messages.size} messages`))
                .catch(console.error);
        };
        // wait to delete message
        channel.fetchMessage(channel.lastMessageID)
            .then(message => message.delete(5000))
            .catch(console.error);
    }
};

function chooseDel(msg) {
    const isCommand = msg.content.startsWith("!") || msg.content.startsWith("~");
    return msg.author.bot || isCommand;
}
