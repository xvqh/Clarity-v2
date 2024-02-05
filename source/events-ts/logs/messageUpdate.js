export default {
    name: 'messageUpdate',
    run: async (client, oldMessage, newMessage) => {
        let message = newMessage
        if (!message.guild) return;
        //     si l ancien contenu du message est egal au nouveau contenu return
        if (oldMessage.content === newMessage.content) return;
        let channel = client.data.get(`msglogs_${message.guild.id}`);
        if (!channel) return;
        let chan = message.guild.channels.cache.get(channel);
        if (!chan) return;
        let ignored = client.data.get(`msglogs_allow_${message.channel.id}`);
        if (ignored === true) return;

        // si l autheur modifie son message envoie un embed avec l ancien contenu et le nouveau contenu du message

        if (chan) chan.send({
            embeds: [{
                color: parseInt(client.color.replace("#", ""), 16),
                author: {
                    name: message.author.username,
                    iconURL: message.author.displayAvatarURL({ dynamic: true })
                },
                description: `Message modifié dans [${message.channel.name}](https://discord.com/channels/${message.guild.id}/${message.channel.id})`,
                fields: [{
                    name: "avant:",
                    value: `${oldMessage.content} (\`${message.id}\`)`,
                }, {
                    name: "apres:",
                    value: `${newMessage.content} (\`${message.id}\`)`,
                }],
                timestamp: new Date(),
                color: parseInt(client.color.replace("#", ""), 16),
                footer: client.config.footer,
                thumbnail: {
                    url: message.author.displayAvatarURL({ dynamic: true })
                }
            }]
        })
    }
}