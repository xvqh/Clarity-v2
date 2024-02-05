import { BaseGuildTextChannel, Client, GuildMember } from "discord.js";

export default {
    name: 'guildMemberUpdate',
    run: async (client: Client, oldMember: GuildMember, newMember: GuildMember) => {
        const { guild } = newMember;
        const oldStatus = oldMember.premiumSince;
        const newStatus = newMember.premiumSince;

        let logs = client.data.get(`boostlogs_${guild.id}`);
        if (!logs) return;
        let channel = guild.channels.cache.get(logs);
        if (!channel) return;

        // member boosted the server
        if (!oldStatus && newStatus) {
            if (channel) (channel as BaseGuildTextChannel).send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: newMember.user.username,
                        icon_url: newMember.user.displayAvatarURL({ forceStatic: false }) as string
                    },
                    description: `Le membre ${newMember} (${newMember.user.id}) a boosté le serveur`,
                    timestamp: new Date().getTime() as unknown as string,
                    footer: client.config.footer,
                    thumbnail: {
                        url: newMember.user.displayAvatarURL({ forceStatic: false })
                    }
                }]
            })
        }
        // member unboosted the server
        if (oldStatus && !newStatus) {
            if (channel) (channel as BaseGuildTextChannel).send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: newMember.user.username,
                        icon_url: newMember.user.displayAvatarURL({ forceStatic: false })
                    },
                    description: `Le membre ${newMember} (${newMember.user.id}) a arrêter de boost le serveur`,
                    timestamp: new Date().getTime() as unknown as string,
                    footer: client.config.footer,
                    thumbnail: {
                        url: newMember.user.displayAvatarURL({ forceStatic: false })
                    }
                }]
            })
        }



    }
}