module.exports = {
    name: 'guildMemberUpdate',
    run: async (client, oldMember, newMember) => {
        const { guild } = newMember;
        const oldStatus = oldMember.premiumSince;
        const newStatus = newMember.premiumSince;

        let logs = client.data.get(`boostlogs_${guild.id}`);
        if (!logs) return;
        let channel = guild.channels.cache.get(logs);
        if (!channel) return;

        // member boosted the server
        if(!oldStatus && newStatus) {
            if (channel)  channel.send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: newMember.user.username,
                        iconURL: newMember.user.displayAvatarURL({ dynamic: true })
                    },
                    description: `Le membre ${newMember} (${newMember.user.id}) a boosté le serveur`,
                    timestamp: new Date(),
                    color: parseInt(client.color.replace("#", ""), 16),
                    footer: client.config.footer,
                    thumbnail: {
                        url: newMember.user.displayAvatarURL({ dynamic: true })
                    }
                }]
            })
        }
        // member unboosted the server
        if (oldStatus && !newStatus) {
            if (channel)   channel.send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: newMember.user.username,
                        iconURL: newMember.user.displayAvatarURL({ dynamic: true })
                    },
                    description: `Le membre ${newMember} (${newMember.user.id}) a arrêter de boost le serveur`,
                    timestamp: new Date(),
                    color: parseInt(client.color.replace("#", ""), 16),
                    footer: client.config.footer,
                    thumbnail: {
                        url: newMember.user.displayAvatarURL({ dynamic: true })
                    }
                }]
            })
        }



    }
}