export default {
    name: 'channelUpdate',
    run: async (client, oldChannel, newChannel) => {
        // get audit log
        const auditLog = await newChannel.guild.fetchAuditLogs({
            limit: 1,
            type: 11
        })
        // get entry
        const entry = auditLog.entries.first()
        if (!entry) return;
        // get executor
        // si y a une entry get l executeur
        const executor = await entry.executor.fetch()

        let logs = client.data.get(`channellogs_${newChannel.guild.id}`);
        if (!logs) return;
        let chan = newChannel.guild.channels.cache.get(logs);
        if (!chan) return;


        // channel name change
        if (oldChannel.name !== newChannel.name) {
            if (chan) chan.send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor.username,
                        iconURL: executor.displayAvatarURL({ dynamic: true })
                    },
                    description: `Le nom du salon ${newChannel.name} (${newChannel.id}) a �t� modifi� par ${executor.username} (${executor.id})`,
                    fields: [{
                        name: 'Ancien nom',
                        value: oldChannel.name,
                    }, {
                        name: "Nom du salon",
                        value: newChannel.name,
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
        // channel topic change
        if (oldChannel.topic !== newChannel.topic) {
            if (chan) chan.send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor.username,
                        iconURL: executor.displayAvatarURL({ dynamic: true })
                    },
                    description: `Le topic du salon ${newChannel.name} (${newChannel.id}) a �t� modifi� par ${executor.username} (${executor.id})`,
                    fields: [{
                        name: 'Ancien topic',
                        value: oldChannel.topic,
                    }, {
                        name: "Topic du salon",
                        value: newChannel.topic,
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
        // channel position change
        if (oldChannel.position !== newChannel.position) {
            if (chan) chan.send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor.username,
                        iconURL: executor.displayAvatarURL({ dynamic: true })
                    },
                    description: `La position du salon ${newChannel.name} (${newChannel.id}) a �t� modifi� par ${executor.username} (${executor.id})`,
                    fields: [{
                        name: 'Ancienne position',
                        value: oldChannel.position,
                    }, {
                        name: "Position du salon",
                        value: newChannel.position,
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
        // channel nsfw change
        if (oldChannel.nsfw !== newChannel.nsfw) {
            if (chan) chan.send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor.username,
                        iconURL: executor.displayAvatarURL({ dynamic: true })
                    },
                    description: `Le nsfw du salon ${newChannel.name} (${newChannel.id}) a �t� modifi� par ${executor.username} (${executor.id})`,
                    fields: [{
                        name: 'Ancien nsfw',
                        value: oldChannel.nsfw,
                    }, {
                        name: "Nsfw du salon",
                        value: newChannel.nsfw,
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
        // channel bitrate change
        if (oldChannel.bitrate !== newChannel.bitrate) {
            if (chan) chan.send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor.username,
                        iconURL: executor.displayAvatarURL({ dynamic: true })
                    },
                    description: `Le bitrate du salon ${newChannel.name} (${newChannel.id}) a �t� modifi� par ${executor.username} (${executor.id})`,
                    fields: [{
                        name: 'Ancien bitrate',
                        value: oldChannel.bitrate,
                    }, {
                        name: "Bitrate du salon",
                        value: newChannel.bitrate,
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
        // channel user limit change
        if (oldChannel.userLimit !== newChannel.userLimit) {
            if (chan) chan.send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor.username,
                        iconURL: executor.displayAvatarURL({ dynamic: true })
                    },
                    description: `Le user limit du salon ${newChannel.name} (${newChannel.id}) a �t� modifi� par ${executor.username} (${executor.id})`,
                    fields: [{
                        name: 'Ancien user limit',
                        value: oldChannel.userLimit,
                    }, {
                        name: "User limit du salon",
                        value: newChannel.userLimit,
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
        // channel rate limit change
        if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
            if (chan) chan.send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor.username,
                        iconURL: executor.displayAvatarURL({ dynamic: true })
                    },
                    description: `Le rate limit du salon ${newChannel.name} (${newChannel.id}) a �t� modifi� par ${executor.username} (${executor.id})`,
                    fields: [{
                        name: 'Ancien rate limit',
                        value: oldChannel.rateLimitPerUser,
                    }, {
                        name: "Rate limit du salon",
                        value: newChannel.rateLimitPerUser,
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
        // channel permission change
        if (oldChannel.permissions !== newChannel.permissions) {
            if (chan) chan.send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor.username,
                        iconURL: executor.displayAvatarURL({ dynamic: true })
                    },
                    description: `Le permission du salon ${newChannel.name} (${newChannel.id}) a �t� modifi� par ${executor.username} (${executor.id})`,
                    fields: [{
                        name: 'Ancien permission',
                        value: oldChannel.permissions,
                    }, {
                        name: "Permission du salon",
                        value: newChannel.permissions,
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
        // channel parent change
        if (oldChannel.parent !== newChannel.parent) {
            if (chan) chan.send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor.username,
                        iconURL: executor.displayAvatarURL({ dynamic: true })
                    },
                    description: `Le parent du salon ${newChannel.name} (${newChannel.id}) a �t� modifi� par ${executor.username} (${executor.id})`,
                    fields: [{
                        name: 'Ancien parent',
                        value: oldChannel.parent,
                    }, {
                        name: "Parent du salon",
                        value: newChannel.parent,
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
    }
}