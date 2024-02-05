import { BaseGuildTextChannel, ChannelType, Client, Message, VoiceState } from "discord.js";

export default {
    name: 'messageUpdate',
    run: async (client: Client, oldMessage: Message, newMessage: Message) => {
        let message = newMessage
        if (!message.guild || message.channel.type === ChannelType.DM) return;
        //     si l ancien contenu du message est egal au nouveau contenu return
        if (oldMessage.content === newMessage.content) return;
        let channel = client.data.get(`msglogs_${message.guild.id}`);
        if (!channel) return;
        let chan = message.guild.channels.cache.get(channel);
        if (!chan) return;
        let ignored = client.data.get(`msglogs_allow_${message.channel.id}`);
        if (ignored === true) return;

        // si l autheur modifie son message envoie un embed avec l ancien contenu et le nouveau contenu du message

        if (chan) (chan as BaseGuildTextChannel).send({
            embeds: [{
                color: parseInt(client.color.replace("#", ""), 16),
                author: {
                    name: message.author.username,
                    icon_url: message.author.displayAvatarURL({ forceStatic: false })
                },
                description: `Message modifié dans [${message.channel.name}](https://discord.com/channels/${message.guild.id}/${message.channel.id})`,
                fields: [
                    {
                        name: "avant:",
                        value: `${oldMessage.content} (\`${message.id}\`)`,
                    },
                    {
                        name: "apres:",
                        value: `${newMessage.content} (\`${message.id}\`)`,
                    }
                ],
                timestamp: new Date().getTime() as unknown as string,
                footer: client.config.footer,
                thumbnail: {
                    url: message.author.displayAvatarURL({ forceStatic: false })
                }
            }]
        })
    }
}