const Badges = {
    'HypeSquadOnlineHouse1': "HypeSquad Bravery",
    'HypeSquadOnlineHouse2': "HypeSquad Brilliance",
    'HypeSquadOnlineHouse3': "HypeSquad Balance",
    'HypeSquadEvents': "HypeSquad Event",
    'ActiveDeveloper': 'Active Developer',
    'BugHunterLeve1': 'Bug Hunter Level 1',
    'EarlySupporter': 'Early Supporter',
    'VerifiedBotDeveloper': 'Verified Bot Developer',
    'EarlyVerifiedBotDeveloper': "Early Verified Bot Developer",
    'VerifiedBot': "Verified Bot",
    'PartneredServerOwner': "Partnered Server Owner",
    'Staff': "Discord Staff",
    'System': "Discord System",
    'BugHunterLevel2': 'Bug Hunter Level 2',
    'BugHunterLevel3': 'Bug Hunter Level 3',
};
module.exports = {
    name: "userinfo",
    aliases: ['ui'],
   category: "💻〢Informations",
    run: async(client, message, args) => {
        let user = message.mentions.users.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => null);
        if (!user) {
            user = message.author;
        }
        if (message.guild.members.cache.has(user.id)){
            let member = message.guild.members.cache.get(args[0]) || message.member;
            const dateJoined = Math.floor(member.joinedTimestamp / 1000)
            const dateCreated = Math.floor(user.createdTimestamp / 1000)
            const url = await user.fetch().then((user) => user.bannerURL({ format: "png", dynamic: true, size: 4096 }));
            const badges = user.flags.toArray();
            let hasBadges = false;
            let userBadges = [];
    
            for (const badge of badges) {
                if (Badges[badge]) {
                    hasBadges = true;
                    userBadges.push(Badges[badge]);
                }
            }
    
            if (user.avatar.startsWith('a_')) {
                hasBadges = true;
                userBadges.push('Nitro');
            }
            let status = member.presence.status;
        switch (status) { case 'online': status = '🟢'; break; case 'idle': status = '🌙'; break; case 'dnd': status = '⛔'; break; default: status = '⚫'; }
        let statusperso = member.presence.activities[0]?.state || "Aucune activité";
        if (statusperso === null) {
            statusperso = "Aucune activité";
        }
            const platforms = Object.keys(member.presence.clientStatus).filter(
                key => ['online', 'dnd', 'idle', 'offline'].includes(member.presence.clientStatus[key])
              );
            const platformString = platforms.map(platform => {
                if (platform === 'desktop') return '`🖥️ Computer`';
            if (platform === 'mobile') return '`📱 Phone`';
                return '`🌐 Web`';
              }).join(', ');
            let roles = member.roles.cache
            .filter(e => e?.id !== message.guild.id)
            .map((r) => `<@&${r.id}>`)
            .join(",");

            if (roles.length > 1024) roles = roles.substring(0, 1020) + "...";
            let cms = ""
            client.guilds.cache.map(r =>{
             const list = client.guilds.cache.get(r.id);
             list.members.cache.map(m => (m.user.id ==user.id? cms++ : cms = cms)) 
             }) 
            let color =  parseInt(client.color.replace("#", ""), 16);
            message.channel.send({
                embeds: [{
                    color: color,
                    author: {
                        name: `À propos de ${user.username}`,
                        icon_url: user.displayAvatarURL({ dynamic: true })
                    },
                    footer: client.config.footer,
                    timestamp: new Date(),
                    description: `\`🛡️\` ┆ Pseudo : [${user.username}](discord://-/users/${user.id})\n\`🆔\` ┆ ID : [${user.id}](discord://-/users/${user.id})\n\`🎉\` ┆ Crée le : <t:${dateCreated}:d>\n\`❓\` ┆ Rejoins le : <t:${dateJoined}:d>\n\`✨\` ┆ Roles ${member.roles.cache.filter(e => e.id !== message.guild.id).size === 0 ?  ": Aucun Rôle" : `[${member.roles.cache.filter(e => e.id !== message.guild.id).size}] : ${roles}`}\n\`🚨\` ┆ Serveurs en commun : ${cms}\n\`🔗\` ┆ Plateforme : ${platformString}\n\`💎\` ┆ Badges[${userBadges.length}]:\n\`${userBadges.join(',')}\`\n\`🎈\` ┆ Status: \`${status}\` - \`(${statusperso})\`\n\`🤖\` ┆ Robot: ${user.bot ? '\`✅\`' : '\`❌\`'}`,
                    image: {
                        url: url
                    },
                    thumbnail: {
                        url: user.displayAvatarURL({dynamic: true}),
                    }
                }
                ], components: [{
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "Lien du profil",
                            url: `https://discord.com/users/${user.id}`,
                            style: 5
                        }
                    ]
                }]
            })
        } else {
           
            const dateCreated = Math.floor(user.createdTimestamp / 1000)
            const url = await user.fetch().then((user) => user.bannerURL({ format: "png", dynamic: true, size: 4096 }));
            console.log(url)
            let color =  parseInt(client.color.replace("#", ""), 16);
            message.channel.send({
                embeds: [{
                    color: color,
                    author: {
                        name: `À propos de ${user.username}`,
                        icon_url: user.displayAvatarURL({ dynamic: true })
                    },
                    footer: client.config.footer,
                    timestamp: new Date(),
                    description: `\`🛡️\` ┆ Pseudo : [${user.username}](discord://-/users/${user.id})\n\`🆔\` ┆ ID : [${user.id}](discord://-/users/${user.id})\n\`🎉\` ┆ Crée le : <t:${dateCreated}:d>\n`,
                    image: {
                        url: url
                    },
                    thumbnail: {
                        url: user.displayAvatarURL({dynamic: true}),
                    }
                }
                ]
            })
        }
       
    }
}