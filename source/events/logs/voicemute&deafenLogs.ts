import { Base, BaseGuildTextChannel, Client, VoiceState } from "discord.js";

export default {
    name: 'voiceStateUpdate',
    run: async (client: Client, oldState: VoiceState, newState: VoiceState) => {
        const { member, guild } = oldState;
        const channel = member?.voice.channel;
        if (!channel) return;
        let db = client.data.get(`voicelogs_${guild.id}`);
        if (!db) return;
        const chan = member.guild.channels.cache.get(db);
        if (!chan) return;
        let deafType = newState.serverDeaf ? 'deafen' : newState.selfDeaf ? 'self-deafen' : 'undeafen';
        let muteType = newState.serverMute ? 'mute' : newState.selfMute ? 'self-mute' : 'unmute';

        // Fetch the audit logs
        let logs = (await guild.fetchAuditLogs({ limit: 1, type: 24 })).entries.first();

        let executor = logs?.executor
        let target = logs?.target

        // Check if the target of the log entry is the member who had their mute or deafen status changed
        if (target?.id === member.id) {
            // serverdeaf
            if (oldState.serverDeaf !== newState.serverDeaf) {
                if (chan) (chan as BaseGuildTextChannel).send({
                    embeds: [{
                        author: { name: `${member.user.username}`, icon_url: member.user.displayAvatarURL({ forceStatic: false }) },
                        thumbnail: { url: member.user.displayAvatarURL({ forceStatic: false }) },
                        title: newState.channel?.name,
                        color: parseInt(client.color.replace("#", ""), 16),
                        description: `${member} a été ${deafType} par ${executor?.username} | (\`${executor?.id}\`)`,
                        timestamp: new Date().getTime() as unknown as string,
                        footer: {
                            text: client.config.footer.text
                        }
                    }]
                })
            }
            // selfdeaf
            if (oldState.selfDeaf !== newState.selfDeaf) {
                if (chan) (chan as BaseGuildTextChannel).send({
                    embeds: [{
                        author: { name: `${member.user.username}`, icon_url: member.user.displayAvatarURL({ forceStatic: false }) },
                        thumbnail: { url: member.user.displayAvatarURL({ forceStatic: false }) },
                        title: newState.channel?.name,
                        color: parseInt(client.color.replace("#", ""), 16),
                        description: `${member} a été ${deafType} par ${executor?.username} | (\`${executor?.id}\`)`,
                        timestamp: new Date().getTime() as unknown as string,
                        footer: {
                            text: client.config.footer.text
                        }
                    }]
                })
            }
            // servermute
            if (oldState.serverMute !== newState.serverMute) {
                if (chan) (chan as BaseGuildTextChannel).send({
                    embeds: [{
                        author: { name: `${member.user.username}`, icon_url: member.user.displayAvatarURL({ forceStatic: false }) },
                        thumbnail: { url: member.user.displayAvatarURL({ forceStatic: false }) },
                        title: newState.channel?.name,
                        color: parseInt(client.color.replace("#", ""), 16),
                        description: `${member} a été ${muteType} par ${executor?.username} | (\`${executor?.id}\`)`,
                        timestamp: new Date().getTime() as unknown as string,
                        footer: {
                            text: client.config.footer.text
                        }
                    }]
                })
            }
            // selfmute
            if (oldState.selfMute !== newState.selfMute) {
                if (chan) (chan as BaseGuildTextChannel).send({
                    embeds: [
                        {
                            author: { name: `${member.user.username}`, icon_url: member.user.displayAvatarURL({ forceStatic: false }) },
                            thumbnail: { url: member.user.displayAvatarURL({ forceStatic: false }) },
                            title: newState.channel?.name,
                            color: parseInt(client.color.replace("#", ""), 16),
                            description: `${member} a été ${muteType} par ${executor?.username} | (\`${executor?.id}\`)`,
                            timestamp: new Date().getTime() as unknown as string,
                            footer: {
                                text: client.config.footer.text
                            }
                        }
                    ]
                })
            }
        }
    }
}