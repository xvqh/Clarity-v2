module.exports = {
    name: 'guildMemberAdd',
    run: async(client, member) => {
        const {guild} = member
        if(!guild) return
       let logs = client.data.get(`joinsleave_${guild.id}`)
        if(!logs) return
        let chan = guild.channels.cache.get(logs);
        if(!chan) return
        if(member.user.bot) {
            try {
                let user = (await guild.fetchAuditLogs({type: 28})).entries.find((e) => e.targetId === client.user.id)

                if (chan) chan.send({
                embeds: [{
                    author: {name: `${member.user.username}`, icon_url: member.user.displayAvatarURL({dynamic: true})},
                    thumbnail: {url: member.user.displayAvatarURL({dynamic: true})},
                    title: guild.name,
                    color: parseInt(client.color.replace("#", ""), 16),
                    description: `${member} a rejoint le serveur inviter par ${user.executor.username} | (\`${user.executor.id}\`)`,
                    timestamp: new Date(),
                    footer: {
                        text: client.config.footer.text
                    }
                }]
            })
        } catch(e) {
            console.log(e)
        }
        } else {
            if (chan)  chan.send({
                embeds: [{
                    author: {name: `${member.user.username}`, icon_url: member.user.displayAvatarURL({dynamic: true})},
                    thumbnail: {url: member.user.displayAvatarURL({dynamic: true})},
                    title: guild.name,
                    color: parseInt(client.color.replace("#", ""), 16),
                    description: `${member} viens de rejoindre ${guild.name} nous sommes maintenant ${guild.memberCount}`,
                    timestamp: new Date(),
                    footer: {
                        text: client.config.footer.text
                    }
                }]
            })
        }
    }
}