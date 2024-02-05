export default {
    name: 'logs',
    run: async (client, message, args) => {
        let msg = await message.channel.send({
            content: 'Chargement en cours du module. . . '
        })
        await update(client, message, msg)
    }
};

async function update(client, message, msg) {
    msg.edit({
        content: null,
        embeds: [{
            title: message.guild.name + ' Logs',
            description: 'Voici les logs du serveur',
            fields: [{
                name: 'Logs message',
                value: `${message.guild.channels.cache.get(client.data.get(`msglogs_${message.guild.id}`)) ? message.guild.channels.cache.get(client.data.get(`msglogs_${message.guild.id}`)) : 'Non configurer'}`,
                inline: true
            }, {
                name: 'Logs modération',
                value: `${message.guild.channels.cache.get(client.data.get(`modlogs_${message.guild.id}`)) ? message.guild.channels.cache.get(client.data.get(`modlogs_${message.guild.id}`)) : 'Non configurer'}`,
                inline: true
            }, {
                name: 'Logs vocal',
                value: `${message.guild.channels.cache.get(client.data.get(`voicelogs_${message.guild.id}`)) ? message.guild.channels.cache.get(client.data.get(`voicelogs_${message.guild.id}`)) : 'Non configurer'}`,
                inline: true
            }, {
                name: 'Logs join/leave',
                value: `${message.guild.channels.cache.get(client.data.get(`joinsleave_${message.guild.id}`)) ? message.guild.channels.cache.get(client.data.get(`joinsleave_${message.guild.id}`)) : 'Non configurer'}`,
                inline: true
            }, {
                name: 'Logs boosts',
                value: `${message.guild.channels.cache.get(client.data.get(`boostlogs_${message.guild.id}`)) ? message.guild.channels.cache.get(client.data.get(`boostlogs_${message.guild.id}`)) : 'Non configurer'}`,
                inline: true
            }, {
                name: 'Logs giveaway',
                value: `${message.guild.channels.cache.get(client.data.get(`giveawaylogs_${message.guild.id}`)) ? message.guild.channels.cache.get(client.data.get(`giveawaylogs_${message.guild.id}`)) : 'Non configurer'}`,
                inline: true
            }, {
                name: 'Logs ticket',
                value: `${message.guild.channels.cache.get(client.data.get(`ticketlogs_${message.guild.id}`)) ? message.guild.channels.cache.get(client.data.get(`ticketlogs_${message.guild.id}`)) : 'Non configurer'}`,
                inline: true
            }, {
                name: 'Logs emojis',
                value: `${message.guild.channels.cache.get(client.data.get(`emojilogs_${message.guild.id}`)) ? message.guild.channels.cache.get(client.data.get(`emojilogs_${message.guild.id}`)) : 'Non configurer'}`,
                inline: true
            }, {
                name: 'Logs role',
                value: `${message.guild.channels.cache.get(client.data.get(`rolelogs_${message.guild.id}`)) ? message.guild.channels.cache.get(client.data.get(`rolelogs_${message.guild.id}`)) : 'Non configurer'}`,
                inline: true
            }, {
                name: 'Logs channel',
                value: `${message.guild.channels.cache.get(client.data.get(`channellogs_${message.guild.id}`)) ? message.guild.channels.cache.get(client.data.get(`channellogs_${message.guild.id}`)) : 'Non configurer'}`,
                inline: true
            }, {
                name: 'Logs bot',
                value: `${message.guild.channels.cache.get(client.data.get(`botlogs_${message.guild.id}`)) ? message.guild.channels.cache.get(client.data.get(`botlogs_${message.guild.id}`)) : 'Non configurer'}`,
                inline: true
            }, {
                name: 'Logs perms',
                value: `${message.guild.channels.cache.get(client.data.get(`permlogs_${message.guild.id}`)) ? message.guild.channels.cache.get(client.data.get(`permlogs_${message.guild.id}`)) : 'Non configurer'}`,
                inline: true
            }, {
                name: 'Logs verification',
                value: `${message.guild.channels.cache.get(client.data.get(`veriflogs_${message.guild.id}`)) ? message.guild.channels.cache.get(client.data.get(`veriflogs_${message.guild.id}`)) : 'Non configurer'}`,
                inline: true
            }, {
                name: 'Logs sys',
                value: `${message.guild.channels.cache.get(client.data.get(`syslogs_${message.guild.id}`)) ? message.guild.channels.cache.get(client.data.get(`syslogs_${message.guild.id}`)) : 'Non configurer'}`,
                inline: true
            }, {
                name: 'Logs badword',
                value: `${message.guild.channels.cache.get(client.data.get(`badwordlogs_${message.guild.id}`)) ? message.guild.channels.cache.get(client.data.get(`badwordlogs_${message.guild.id}`)) : 'Non configurer'}`,
                inline: true
            }, {
                name: 'Logs flop',
                value: `${message.guild.channels.cache.get(client.data.get(`floplogs_${message.guild.id}`)) ? message.guild.channels.cache.get(client.data.get(`floplogs_${message.guild.id}`)) : 'Non configurer'}`,
                inline: true
            }, {
                name: 'Logs bump',
                value: `${message.guild.channels.cache.get(client.data.get(`bumplogs_${message.guild.id}`)) ? message.guild.channels.cache.get(client.data.get(`bumplogs_${message.guild.id}`)) : 'Non configurer'}`,
                inline: true
            }, {
                name: 'Logs guild',
                value: `${message.guild.channels.cache.get(client.data.get(`guildlogs_${message.guild.id}`)) ? message.guild.channels.cache.get(client.data.get(`guildlogs_${message.guild.id}`)) : 'Non configurer'}`,
                inline: true
            }, {
                name: 'Logs commands',
                value: `${message.guild.channels.cache.get(client.data.get(`commandlogs_${message.guild.id}`)) ? message.guild.channels.cache.get(client.data.get(`commandlogs_${message.guild.id}`)) : 'Non configurer'}`,
                inline: true
            }, {
                name: 'Logs scam',
                value: `${message.guild.channels.cache.get(client.data.get(`scamlogs_${message.guild.id}`)) ? message.guild.channels.cache.get(client.data.get(`scamlogs_${message.guild.id}`)) : 'Non configurer'} `,
                inline: true
            }, {
                name: 'Logs webhook',
                value: `${message.guild.channels.cache.get(client.data.get(`webhooklogs_${message.guild.id}`)) ? message.guild.channels.cache.get(client.data.get(`webhooklogs_${message.guild.id}`)) : 'Non configurer'} `,
                inline: true
            }, {
                name: 'Logs thread',
                value: `${message.guild.channels.cache.get(client.data.get(`threadlogs_${message.guild.id}`)) ? message.guild.channels.cache.get(client.data.get(`threadlogs_${message.guild.id}`)) : 'Non configurer'} `,
                inline: true
            }, {
                name: 'Logs event',
                value: `${message.guild.channels.cache.get(client.data.get(`eventlogs_${message.guild.id}`)) ? message.guild.channels.cache.get(client.data.get(`eventlogs_${message.guild.id}`)) : 'Non configurer'} `,
                inline: true
            }, {
                name: 'Logs sticker',
                value: `${message.guild.channels.cache.get(client.data.get(`stickerlogs_${message.guild.id}`)) ? message.guild.channels.cache.get(client.data.get(`stickerlogs_${message.guild.id}`)) : 'Non configurer'} `,
                inline: true
            }],
            footer: client.config.footer,
            color: parseInt(client.color.replace("#", ""), 16)
        }]
    })
}