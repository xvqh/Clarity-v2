export default {
    name: 'messageDelete',
    run: async (client, message) => {
        if (!message || !message.author || !message.guild) {
            return;
        }

        if (message.author.id === client.user.id) {
            return;
        }
        let channel = client.data.get(`msglogs_${message.guild.id}`);
        if (!channel) return;
        let chan = message.guild.channels.cache.get(channel);
        if (!chan) return;
        let ignored = client.data.get(`msglogs_allow_${message.channel.id}`);
        if (ignored === true) return;



        // send message to log channel
        if (chan) chan.send({
            embeds: [{
                color: parseInt(client.color.replace("#", ""), 16),
                author: {
                    name: message.author.username,
                    iconURL: message.author.displayAvatarURL({ dynamic: true })
                },
                description: `${message.content} (\`${message.id}\`) supprimé dans [${message.channel.name}](https://discord.com/channels/${message.guild.id}/${message.channel.id})`,
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