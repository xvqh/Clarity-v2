
export default {
    name: "channel",
    run: async (client, message, args) => {
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel
        message.channel.send({
            embeds: [{
                title: `Informations sur` + " " + channel.name,
                fields: [{
                    name: "Nom",
                    value: channel.name,
                    inline: true
                }, {
                    name: "ID",
                    value: channel.id,
                    inline: true
                }, {
                    name: "Type",
                    value: `${channel.type === 0 ? 'Text' : 'Vocal'}`,
                    inline: true
                }, {
                    name: "Position",
                    value: channel.position,
                    inline: true
                }, {
                    name: "Catégorie",
                    value: channel.parent.name,
                    inline: true
                }, {
                    name: "Catégorie ID",
                    value: channel.parentId,
                    inline: true
                }, {
                    name: "Salon crée",
                    value: `<t:${Math.floor(channel.createdTimestamp / 1000)}:R>`,
                    inline: true
                }, {
                    name: "Salon NSFW",
                    value: `${channel.nsfw ? 'Oui' : 'Non'}`,
                    inline: true
                }],
                color: client.color,
                footer: client.config.footer
            }]
        })
    }
}