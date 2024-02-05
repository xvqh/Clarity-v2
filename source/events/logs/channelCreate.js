export default {
    name: 'channelCreate',
    run: async (client, channel) => {
        // get audit log
        const auditLog = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: 10
        })

        // get entry
        const entry = auditLog.entries.first()

        // get executor
        const executor = await entry.executor.fetch()

        let logs = client.data.get(`channellogs_${channel.guild.id}`);
        if (!logs) return;
        let chan = channel.guild.channels.cache.get(logs);
        if (!chan) return;
        if (executor.id === client.user.id) return;

        // text channel
        if (channel.type === 0) {
            if (chan) chan.send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor.username,
                        iconURL: executor.displayAvatarURL({ dynamic: true })
                    },
                    description: `Nouveau salon créé par ${executor.username} (${executor.id})`,
                    fields: [{
                        name: "Nom du salon",
                        value: channel.name
                    }, {
                        name: "ID du salon",
                        value: channel.id
                    }, {
                        name: "Type du salon",
                        value: channel.type
                    }],
                    timestamp: new Date(),
                    color: parseInt(client.color.replace("#", ""), 16),
                    footer: client.config.footer,
                    thumbnail: {
                        url: executor.displayAvatarURL({ dynamic: true })
                    }
                }]
            })
        }
        // voice channel
        if (channel.type === 2) {
            if (chan) chan.send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor.username,
                        iconURL: executor.displayAvatarURL({ dynamic: true })
                    },
                    description: `Nouveau salon créé par ${executor.username} (${executor.id})`,
                    fields: [{
                        name: "Nom du salon",
                        value: channel.name
                    }, {
                        name: "ID du salon",
                        value: channel.id
                    }, {
                        name: "Type du salon",
                        value: channel.type
                    }],
                    timestamp: new Date(),
                    color: parseInt(client.color.replace("#", ""), 16),
                    footer: client.config.footer,
                }]
            })
        }
        // news channel
        if (channel.type === 5) {
            if (chan) chan.send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor.username,
                        iconURL: executor.displayAvatarURL({ dynamic: true })
                    },
                    description: `Nouveau salon généré par ${executor.username} (${executor.id})`,
                    fields: [{
                        name: "Nom du salon",
                        value: channel.name
                    }, {
                        name: "ID du salon",
                        value: channel.id
                    }, {
                        name: "Type du salon",
                        value: channel.type
                    }],
                    timestamp: new Date(),
                    color: parseInt(client.color.replace("#", ""), 16),
                    footer: client.config.footer,
                }]
            })
        }
        // category channel
        if (channel.type === 4) {
            if (chan) chan.send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor.username,
                        iconURL: executor.displayAvatarURL({ dynamic: true })
                    },
                    description: `Nouveau salon créé par ${executor.username} (${executor.id})`,
                    fields: [{
                        name: "Nom du salon",
                        value: channel.name
                    }, {
                        name: "ID du salon",
                        value: channel.id
                    }, {
                        name: "Type du salon",
                        value: channel.type
                    }],
                    timestamp: new Date(),
                    color: parseInt(client.color.replace("#", ""), 16),
                    footer: client.config.footer,
                }]
            })
        }
        // store channel
        if (channel.type === 13) {
            if (chan) chan.send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor.username,
                        iconURL: executor.displayAvatarURL({ dynamic: true })
                    },
                    description: `Nouveau salon créé par ${executor.username} (${executor.id})`,
                    fields: [{
                        name: "Nom du salon",
                        value: channel.name
                    }, {
                        name: "ID du salon",
                        value: channel.id
                    }, {
                        name: "Type du salon",
                        value: channel.type
                    }],
                    timestamp: new Date(),
                    color: parseInt(client.color.replace("#", ""), 16),
                    footer: client.config.footer,
                }]
            })
        }
        // forum channel
        if (channel.type === 15) {
            if (chan) chan.send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor.username,
                        iconURL: executor.displayAvatarURL({ dynamic: true })
                    },
                    description: `Nouveau salon créé par ${executor.username} (${executor.id})`,
                    fields: [{
                        name: "Nom du salon",
                        value: channel.name
                    }, {
                        name: "ID du salon",
                        value: channel.id
                    }, {
                        name: "Type du salon",
                        value: channel.type
                    }],
                    timestamp: new Date(),
                    color: parseInt(client.color.replace("#", ""), 16),
                    footer: client.config.footer,
                }]
            })
        }
        // media channel
        if (channel.type === 16) {
            if (chan) chan.send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor.username,
                        iconURL: executor.displayAvatarURL({ dynamic: true })
                    },
                    description: `Nouveau salon créé par ${executor.username} (${executor.id})`,
                    fields: [{
                        name: "Nom du salon",
                        value: channel.name
                    }, {
                        name: "ID du salon",
                        value: channel.id
                    }, {
                        name: "Type du salon",
                        value: channel.type
                    }],
                    timestamp: new Date(),
                    color: parseInt(client.color.replace("#", ""), 16),
                    footer: client.config.footer,
                }]
            })
        }
        // thread channel
        if (channel.type === 11) {
            if (chan) chan.send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor.username,
                        iconURL: executor.displayAvatarURL({ dynamic: true })
                    },
                    description: `Nouveau salon généré par ${executor.username} (${executor.id})`,
                    fields: [{
                        name: "Nom du salon",
                        value: channel.name
                    }, {
                        name: "ID du salon",
                        value: channel.id
                    }, {
                        name: "Type du salon",
                        value: channel.type
                    }],
                    timestamp: new Date(),
                    color: parseInt(client.color.replace("#", ""), 16),
                    footer: client.config.footer,
                }]
            })
        }
    }
}
