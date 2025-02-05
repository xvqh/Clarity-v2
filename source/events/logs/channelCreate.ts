import { Base, BaseGuildTextChannel, Client, GuildChannel } from "discord.js";

export default {
    name: 'channelCreate',
    run: async (client: Client, channel: GuildChannel) => {
        // get audit log
        const auditLog = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: 10
        })

        // get entry
        const entry = auditLog.entries.first()

        // get executor
        const executor = await entry?.executor?.fetch()

        let logs = client.data.get(`channellogs_${channel.guild.id}`);
        if (!logs) return;
        let chan = channel.guild.channels.cache.get(logs);
        if (!chan) return;
        if (executor?.id === client.user?.id) return;

        // text channel
        if (channel.type === 0) {
            if (chan) (chan as BaseGuildTextChannel).send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor?.username as string,
                        icon_url: executor?.displayAvatarURL({ forceStatic: false })
                    },
                    description: `Nouveau salon créé par ${executor?.username} (${executor?.id})`,
                    fields: [{
                        name: "Nom du salon",
                        value: channel.name
                    }, {
                        name: "ID du salon",
                        value: channel.id
                    }, {
                        name: "Type du salon",
                        value: channel.type as unknown as string
                    }],
                    timestamp: new Date().getTime() as unknown as string,
                    footer: client.config.footer,
                    thumbnail: {
                        url: executor?.displayAvatarURL({ forceStatic: false }) as string
                    }
                }]
            })
        }
        // voice channel
        if (channel.type === 2) {
            if (chan) (chan as BaseGuildTextChannel).send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor?.username as string,
                        icon_url: executor?.displayAvatarURL({ forceStatic: false })
                    },
                    description: `Nouveau salon créé par ${executor?.username} (${executor?.id})`,
                    fields: [{
                        name: "Nom du salon",
                        value: channel.name
                    }, {
                        name: "ID du salon",
                        value: channel.id
                    }, {
                        name: "Type du salon",
                        value: channel.type as unknown as string
                    }],
                    timestamp: new Date().getTime() as unknown as string,
                    footer: client.config.footer,
                }]
            })
        }
        // news channel
        if (channel.type === 5) {
            if (chan) (chan as BaseGuildTextChannel).send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor?.username as string,
                        icon_url: executor?.displayAvatarURL({ forceStatic: false }) as string
                    },
                    description: `Nouveau salon généré par ${executor?.username} (${executor?.id})`,
                    fields: [{
                        name: "Nom du salon",
                        value: channel.name
                    }, {
                        name: "ID du salon",
                        value: channel.id
                    }, {
                        name: "Type du salon",
                        value: channel.type as unknown as string
                    }],
                    timestamp: new Date().getTime() as unknown as string,
                    footer: client.config.footer,
                }]
            })
        }
        // category channel
        if (channel.type === 4) {
            if (chan) (chan as BaseGuildTextChannel).send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor?.username as string,
                        icon_url: executor?.displayAvatarURL({ forceStatic: false })
                    },
                    description: `Nouveau salon créé par ${executor?.username} (${executor?.id})`,
                    fields: [{
                        name: "Nom du salon",
                        value: channel.name
                    }, {
                        name: "ID du salon",
                        value: channel.id
                    }, {
                        name: "Type du salon",
                        value: channel.type as unknown as string
                    }],
                    timestamp: new Date().getTime() as unknown as string,
                    footer: client.config.footer,
                }]
            })
        }
        // store channel
        if (channel.type === 13) {
            if (chan) (chan as BaseGuildTextChannel).send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor?.username as string,
                        icon_url: executor?.displayAvatarURL({ forceStatic: false })
                    },
                    description: `Nouveau salon créé par ${executor?.username} (${executor?.id})`,
                    fields: [{
                        name: "Nom du salon",
                        value: channel.name
                    }, {
                        name: "ID du salon",
                        value: channel.id
                    }, {
                        name: "Type du salon",
                        value: channel.type as unknown as string
                    }],
                    timestamp: new Date().getTime() as unknown as string,
                    footer: client.config.footer,
                }]
            })
        }
        // forum channel
        if (channel.type === 15) {
            if (chan) (chan as BaseGuildTextChannel).send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor?.username as string,
                        icon_url: executor?.displayAvatarURL({ forceStatic: false })
                    },
                    description: `Nouveau salon créé par ${executor?.username} (${executor?.id})`,
                    fields: [{
                        name: "Nom du salon",
                        value: channel.name
                    }, {
                        name: "ID du salon",
                        value: channel.id
                    }, {
                        name: "Type du salon",
                        value: channel.type as unknown as string
                    }],
                    timestamp: new Date().getTime() as unknown as string,
                    footer: client.config.footer,
                }]
            })
        }
        // media channel
        if (channel.type === 16) {
            if (chan) (chan as BaseGuildTextChannel).send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor?.username as string,
                        icon_url: executor?.displayAvatarURL({ forceStatic: false })
                    },
                    description: `Nouveau salon créé par ${executor?.username} (${executor?.id})`,
                    fields: [{
                        name: "Nom du salon",
                        value: channel.name
                    }, {
                        name: "ID du salon",
                        value: channel.id
                    }, {
                        name: "Type du salon",
                        value: channel.type as unknown as string
                    }],
                    timestamp: new Date().getTime() as unknown as string,
                    footer: client.config.footer,
                }]
            })
        }
        // thread channel
        if (channel.type === 11) {
            if (chan) (chan as BaseGuildTextChannel).send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor?.username as string,
                        icon_url: executor?.displayAvatarURL({ forceStatic: false })
                    },
                    description: `Nouveau salon généré par ${executor?.username} (${executor?.id})`,
                    fields: [{
                        name: "Nom du salon",
                        value: channel.name
                    }, {
                        name: "ID du salon",
                        value: channel.id
                    }, {
                        name: "Type du salon",
                        value: channel.type as unknown as string
                    }],
                    timestamp: new Date().getTime() as unknown as string,
                    footer: client.config.footer,
                }]
            })
        }
    }
}
