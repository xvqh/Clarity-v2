import { Base, BaseGuildTextChannel, BaseGuildVoiceChannel, Client, GuildChannel } from "discord.js";

export default {
    name: 'channelUpdate',
    run: async (client: Client, oldChannel: GuildChannel, newChannel: GuildChannel) => {
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
        const executor = await entry?.executor?.fetch()

        let logs = client.data.get(`channellogs_${newChannel.guild.id}`);
        if (!logs) return;
        let chan = newChannel.guild.channels.cache.get(logs);
        if (!chan) return;


        // channel name change
        if (oldChannel.name !== newChannel.name) {
            if (chan) (chan as BaseGuildTextChannel).send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor?.username as string,
                        icon_url: executor?.displayAvatarURL({ forceStatic: false })
                    },
                    description: `Le nom du salon ${newChannel.name} (${newChannel.id}) a �t� modifi� par ${executor?.username} (${executor?.id})`,
                    fields: [{
                        name: 'Ancien nom',
                        value: oldChannel.name,
                    }, {
                        name: "Nom du salon",
                        value: newChannel.name,
                    }],
                    timestamp: new Date().getTime() as unknown as string,
                    footer: client.config.footer,
                    thumbnail: {
                        url: executor?.displayAvatarURL({ forceStatic: false }) as string
                    }
                }]
            })
        }
        // channel topic change
        if ((oldChannel as BaseGuildTextChannel).topic !== (newChannel as BaseGuildTextChannel).topic) {
            if (chan) (chan as BaseGuildTextChannel).send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor?.username as string,
                        icon_url: executor?.displayAvatarURL({ forceStatic: false })
                    },
                    description: `Le topic du salon ${newChannel.name} (${newChannel.id}) a �t� modifi� par ${executor?.username} (${executor?.id})`,
                    fields: [{
                        name: 'Ancien topic',
                        value: (oldChannel as BaseGuildTextChannel).topic as string,
                    }, {
                        name: "Topic du salon",
                        value: (newChannel as BaseGuildTextChannel).topic as string,
                    }],
                    timestamp: new Date().getTime() as unknown as string,
                    footer: client.config.footer,
                    thumbnail: {
                        url: executor?.displayAvatarURL({ forceStatic: false }) as string
                    }
                }]
            })
        }
        // channel position change
        if (oldChannel.position !== newChannel.position) {
            if (chan) (chan as BaseGuildTextChannel).send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor?.username as string,
                        icon_url: executor?.displayAvatarURL({ forceStatic: false })
                    },
                    description: `La position du salon ${newChannel.name} (${newChannel.id}) a �t� modifi� par ${executor?.username} (${executor?.id})`,
                    fields: [{
                        name: 'Ancienne position',
                        value: oldChannel.position as unknown as string,
                    }, {
                        name: "Position du salon",
                        value: newChannel.position as unknown as string,
                    }],
                    timestamp: new Date().getTime() as unknown as string,
                    footer: client.config.footer,
                    thumbnail: {
                        url: executor?.displayAvatarURL({ forceStatic: false }) as string
                    }
                }]
            })
        }
        // channel nsfw change
        if ((oldChannel as BaseGuildTextChannel).nsfw !== (newChannel as BaseGuildTextChannel).nsfw) {
            if (chan) (chan as BaseGuildTextChannel).send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor?.username as string,
                        icon_url: executor?.displayAvatarURL({ forceStatic: false })
                    },
                    description: `Le nsfw du salon ${newChannel.name} (${newChannel.id}) a �t� modifi� par ${executor?.username} (${executor?.id})`,
                    fields: [{
                        name: 'Ancien nsfw',
                        value: (oldChannel as BaseGuildTextChannel).nsfw ? 'Oui' : 'Non',
                    }, {
                        name: "Nsfw du salon",
                        value: (newChannel as BaseGuildTextChannel).nsfw ? 'Oui' : 'Non',
                    }],
                    timestamp: new Date().getTime() as unknown as string,
                    footer: client.config.footer,
                    thumbnail: {
                        url: executor?.displayAvatarURL({ forceStatic: false }) as string
                    }
                }]
            })
        }
        // channel bitrate change
        if ((oldChannel as BaseGuildVoiceChannel).bitrate !== (newChannel as BaseGuildVoiceChannel).bitrate) {
            if (chan) (chan as BaseGuildTextChannel).send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor?.username as string,
                        icon_url: executor?.displayAvatarURL({ forceStatic: false })
                    },
                    description: `Le bitrate du salon ${newChannel.name} (${newChannel.id}) a �t� modifi� par ${executor?.username} (${executor?.id})`,
                    fields: [{
                        name: 'Ancien bitrate',
                        value: (oldChannel as BaseGuildVoiceChannel).bitrate as unknown as string,
                    }, {
                        name: "Bitrate du salon",
                        value: (newChannel as BaseGuildVoiceChannel).bitrate as unknown as string,
                    }],
                    timestamp: new Date().getTime() as unknown as string,
                    footer: client.config.footer,
                    thumbnail: {
                        url: executor?.displayAvatarURL({ forceStatic: false }) as string
                    }
                }]
            })
        }
        // channel user limit change
        if ((oldChannel as BaseGuildVoiceChannel).userLimit !== (newChannel as BaseGuildVoiceChannel).userLimit) {
            if (chan) (chan as BaseGuildTextChannel).send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor?.username as string,
                        icon_url: executor?.displayAvatarURL({ forceStatic: false })
                    },
                    description: `Le user limit du salon ${newChannel.name} (${newChannel.id}) a �t� modifi� par ${executor?.username} (${executor?.id})`,
                    fields: [{
                        name: 'Ancien user limit',
                        value: (oldChannel as BaseGuildVoiceChannel).userLimit as unknown as string,
                    }, {
                        name: "User limit du salon",
                        value: (newChannel as BaseGuildVoiceChannel).userLimit as unknown as string,
                    }],
                    timestamp: new Date().getTime() as unknown as string,
                    footer: client.config.footer,
                    thumbnail: {
                        url: executor?.displayAvatarURL({ forceStatic: false }) as string
                    }
                }]
            })
        }
        // channel rate limit change
        if ((oldChannel as BaseGuildVoiceChannel).rateLimitPerUser !== (newChannel as BaseGuildVoiceChannel).rateLimitPerUser) {
            if (chan) (chan as BaseGuildTextChannel).send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor?.username as string,
                        icon_url: executor?.displayAvatarURL({ forceStatic: false })
                    },
                    description: `Le rate limit du salon ${newChannel.name} (${newChannel.id}) a �t� modifi� par ${executor?.username} (${executor?.id})`,
                    fields: [{
                        name: 'Ancien rate limit',
                        value: (oldChannel as BaseGuildVoiceChannel).rateLimitPerUser as unknown as string,
                    }, {
                        name: "Rate limit du salon",
                        value: (newChannel as BaseGuildVoiceChannel).rateLimitPerUser as unknown as string,
                    }],
                    timestamp: new Date().getTime() as unknown as string,
                    footer: client.config.footer,
                    thumbnail: {
                        url: executor?.displayAvatarURL({ forceStatic: false }) as string
                    }
                }]
            })
        }
        // channel permission change
        if (oldChannel.permissionOverwrites !== newChannel.permissionOverwrites) {
            if (chan) (chan as BaseGuildTextChannel).send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor?.username as string,
                        icon_url: executor?.displayAvatarURL({ forceStatic: false })
                    },
                    description: `Le permission du salon ${newChannel.name} (${newChannel.id}) a été modifié par ${executor?.username} (${executor?.id})`,
                    fields: [{
                        name: 'Ancien permission',
                        value: oldChannel.permissionOverwrites.cache.first() as unknown as string,
                    }, {
                        name: "Permission du salon",
                        value: newChannel.permissionOverwrites.cache.first() as unknown as string,
                    }],
                    timestamp: new Date().getTime() as unknown as string,
                    footer: client.config.footer,
                    thumbnail: {
                        url: executor?.displayAvatarURL({ forceStatic: false }) as string
                    }
                }]
            })
        }
        // channel parent change
        if (oldChannel.parent !== newChannel.parent) {
            if (chan) (chan as BaseGuildTextChannel).send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: executor?.username as string,
                        icon_url: executor?.displayAvatarURL({ forceStatic: false })
                    },
                    description: `Le parent du salon ${newChannel.name} (${newChannel.id}) a �t� modifi� par ${executor?.username} (${executor?.id})`,
                    fields: [{
                        name: 'Ancien parent',
                        value: oldChannel.parent?.name as string,
                    }, {
                        name: "Parent du salon",
                        value: newChannel.parent?.name as string,
                    }],
                    timestamp: new Date().getTime() as unknown as string,
                    footer: client.config.footer,
                    thumbnail: {
                        url: executor?.displayAvatarURL({ forceStatic: false }) as string
                    }
                }]
            })
        }
    }
}