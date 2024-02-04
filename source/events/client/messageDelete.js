module.exports = {
    name: "messageDelete",
    run: async(client, message) => {
        client.snipes.set(message.channel.id, {
            content: message.content,
            author: message.author,
            image: message.attachments.first() ? message.attachments.first().proxyURL : null
          })
    }
}