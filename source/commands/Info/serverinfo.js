module.exports = {
    name: 'serverinfo',
    aliases: ['si'],
   category: "💻〢Informations",
    run: async (client, message) => {
        let color =  parseInt(client.color.replace("#", ""), 16);
        const rolesGuild = message.guild.roles.cache;
        const membersGuild = message.guild.members.cache;
        const channelsGuild = message.guild.channels.cache;
        const emojisGuild = message.guild.emojis.cache;
        const humans = membersGuild.filter(member =>!member.user.bot).size;
        const boosters = membersGuild.filter(m => m.premiumSince).size;
        const memberOnline = membersGuild.filter(m => m.presence?.status === 'online').size;
        const botGuilds = message.guild.members.cache.filter(m => m.user.bot).size;
         const memberinVoice = membersGuild.filter(member => !member.user.bot && member.voice.channel).size;
        const norolemembers = membersGuild.filter(member =>!member.roles.cache.has(message.guild.id)).size;
        message.channel.send({
            embeds: [{
                title: message.guild.name,
                url: message.guild.iconURL({dynamic: true}),
                thumbnail: {url: message.guild.iconURL({dynamic: true})},
                color: color,
                fields: [{
                    name: "ID",
                    value: `${message.guild.id}`,
                    inline: true
                }, {
                    name: "Nombre de membres",
                    value: `${message.guild.memberCount}` ,
                    inline: true
                },{
                    name: "Nombre de membres en ligne",
                    value: `${memberOnline}`,
                    inline: true
                },{
                    name:"Nombre d'humains",
                    value: `${humans}`,
                    inline: true
                }, {
                    name: "Nombre de bots",
                    value: `${botGuilds}`,
                    inline: true
                }, {
                    name: "Nombre d'utilisateurs en vocal",
                    value: `${memberinVoice}`,
                    inline: true
                }, {
                    name: "Nombre d'utilisateurs sans rôle",
                    value: `${norolemembers}`,
                    inline: true
                }, {
                    name: "Nombre de boosts",
                    value: `${message.guild.premiumSubscriptionCount || '0'}`,
                    inline: true
                },{
                    name: "Nombre de boosters",
                    value: `${boosters}`,
                    inline: true
                },{
                    name: "Niveau de boost",
                    value: `${message.guild.premiumTier}`,
                    inline: true
                }, {
                    name: "Nombre de rôles",
                    value: `${rolesGuild.size}`,
                    inline: true
                }, {
                    name: "Nombre de salons",
                    value: `${channelsGuild.size}`,
                    inline: true
                }, {
                    name: "Nombre d'emojis",
                    value: `${emojisGuild.size}`,
                    inline: true
                }, {
                    name: "Vanity URL",
                    value: message.guild.vanityURLCode? `discord.gg/${message.guild.vanityURLCode}` : `Le serveur ne possède pas d'url`,
                    inline: true
                }, {
                    name: "Verification",
                    value: `${message.guild.verificationLevel}`,
                    inline: true
                }],
                image: {
                    url: message.guild.bannerURL({ dynamic: true, size: 2048})
                },
                footer: client.config.footer,
                timestamp: new Date(),
            }]
        })
    }
}