import { BaseGuildTextChannel, ChannelType, Client, Message } from "discord.js";

export default {
    name: 'messageDelete',
    run: async (client: Client, message: Message) => {
        if (!message || !message.author || !message.guild || message.channel.type === ChannelType.DM) {
            return;
        }

        if (message.author.id === client.user?.id) {
            return;
        }
        let channel = client.data.get(`msglogs_${message.guild.id}`);
        if (!channel) return;
        let chan = message.guild.channels.cache.get(channel);
        if (!chan) return;
        let ignored = client.data.get(`msglogs_allow_${message.channel.id}`);
        if (ignored === true) return;

        // send message to log channel
        if (chan) (chan as BaseGuildTextChannel).send({
            embeds: [{
                color: parseInt(client.color.replace("#", ""), 16),
                author: {
                    name: message.author.username,
                    icon_url: message.author.displayAvatarURL({ forceStatic: false })
                },
                description: `${message.content} (\`${message.id}\`) supprimé dans [${message.channel?.name}](https://discord.com/channels/${message.guild.id}/${message.channel.id})`,
                timestamp: new Date().getTime() as unknown as string,
                footer: client.config.footer,
                thumbnail: {
                    url: message.author.displayAvatarURL({ forceStatic: false })
                }
            }]
        })


    }
}