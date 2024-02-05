export default {
    name: 'guildMemberAdd',
    run: async (client, member) => {
        const { guild } = member
        if (!guild) return

        const db = client.data2.get(`blacklist_${client.user.id}`) || {
            users: [],
            authors: [],
            date: new Date().toISOString(),
            reason: null
        }
        if (!db) return
        const logs = client.data.get(`syslogs_${guild.id}`)
        if (!logs) return
        const chan = guild.channels.cache.get(logs)
        if (!chan) return

        if (db.users.includes(member.user.id)) {
            const authorUser = await client.users.fetch(db.authors[db.users.indexOf(member.user.id)]);
            member.ban({ reason: db.reason })
            chan.send({
                embeds: [{
                    author: { name: `${member.user.username}`, icon_url: member.user.displayAvatarURL({ dynamic: true }) },
                    thumbnail: { url: member.user.displayAvatarURL({ dynamic: true }) },
                    title: guild.name,
                    color: parseInt(client.color.replace("#", ""), 16),
                    description: `${member} a essaye de rejoindre le serveur mais il est blackliste.`,
                    fields: [{
                        name: 'Blacklist Info',
                        value: `ID: ${member.user.id}\nReason: ${db.reason}\nDate: <t:${Math.floor(new Date(db.date).getTime() / 1000)}:R>\nAuthor: ${authorUser}`,
                    }],
                    timestamp: new Date(),
                    footer: {
                        text: client.config.footer.text
                    }
                }]
            })
        }
    }
}
