import Discord from "discord.js";

export default {
    name: "presetlogs",
    category: "Logs",
    aliases: ["presetlog", 'plog', 'plogs'],
    description: "Config auto les logs",
    run: async (client, message, args) => {
        const isOwn = await client.db.oneOrNone(
            `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
            [message.author.id]
        );
        if (!isOwn) {
            return message.reply({
                content: "Vous n'avez pas la permission d'utiliser cette commande",
            });
        }
        if (!args[0]) return message.reply({ content: 'veuillez preciser: <all/min>' })
        if (args[0] === "all") {
            let msg = await message.channel.send({ content: `Création de la **catégorie** des logs en cours..` })
            let category = await message.guild.channels.create({
                name: `${message.guild.name}・LOGS`,
                type: 4,
                permissionOverwrites: [{
                    id: message.guild.roles.everyone.id,
                    allow: [Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.ReadMessageHistory],
                    deny: [Discord.PermissionFlagsBits.ViewChannel],
                }]
            })
            let channelInfo = [
                { name: '📁・logs-raid', dbKey: 'raidlogs_' },
                { name: '📁・logs-modération', dbKey: 'modlogs_' },
                { name: '📁・logs-message', dbKey: 'msglogs_' },
                { name: '📁・logs-vocal', dbKey: 'voicelogs_' },
                { name: '📁・logs-joinleave', dbKey: 'joinsleave_' },
                { name: '📁・logs-boost', dbKey: 'boostlogs_' },
                { name: '📁・logs-giveaway', dbKey: 'giveawaylogs_' },
                { name: '📁・logs-ticket', dbKey: 'ticketlogs_' },
                { name: '📁・logs-emoji', dbKey: 'emojilogs_' },
                { name: '📁・logs-role', dbKey: 'rolelogs_' },
                { name: '📁・logs-channel', dbKey: 'channellogs_' },
                { name: '📁・logs-bot', dbKey: 'botlogs_' },
                { name: '📁・logs-perm', dbKey: 'permlogs_' },
                { name: '📁・logs-verification', dbKey: 'veriflogs_' },
                { name: '📁・logs-sys', dbKey: 'syslogs_' },
                { name: '📁・logs-badword', dbKey: 'badwordlogs_' },
                { name: '📁・logs-flop', dbKey: 'floplogs_' },
                { name: '📁・logs-bump', dbKey: 'bumplogs_' },
                { name: '📁・logs-guild', dbKey: 'guildlogs_' },
                { name: '📁・logs-commands', dbKey: 'commandlogs_' },
                { name: '📁・logs-scam', dbKey: 'scamlogs_' },
                { name: '📁・logs-webhook', dbKey: 'webhooklogs_' },
                { name: '📁・logs-thread', dbKey: 'threadlogs_' },
                { name: '📁・logs-event', dbKey: 'eventlogs_' },
                { name: '📁・logs-sticker', dbKey: 'stickerlogs_' },
            ]
            for (let i = 0; i < channelInfo.length; i++) {
                let channel = await message.guild.channels.create({
                    name: channelInfo[i].name,
                    type: 0,
                    parent: category.id,
                    permissionOverwrites: [{
                        id: message.guild.roles.everyone.id,
                        allow: [Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.ReadMessageHistory],
                        deny: [Discord.PermissionFlagsBits.ViewChannel],
                    }]
                })

                client.data.set(`${channelInfo[i].dbKey}${message.guild.id}`, channel.id)
                msg.edit({ content: `Création de la **catégorie** des logs Terminé` })
            }

        }
        if (args[0] === "min") {

            let msg = await message.channel.send({ content: `Création de la **catégorie** des logs en cours..` })
            let category = await message.guild.channels.create({
                name: `${message.guild.name}・LOGS`,
                type: 4,
                permissionOverwrites: [{
                    id: message.guild.roles.everyone.id,
                    allow: [Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.ReadMessageHistory],
                    deny: [Discord.PermissionFlagsBits.ViewChannel],
                }]
            })
            let channelInfo = [
                { name: '📁・logs-raid', dbKey: 'raidlogs_' },
                { name: '📁・logs-modération', dbKey: 'modlogs_' },
                { name: '📁・logs-message', dbKey: 'msglogs_' },
                { name: '📁・logs-vocal', dbKey: 'voicelogs_' },
                { name: '📁・logs-joinleave', dbKey: 'joinsleave_' },
                { name: '📁・logs-guild', dbKey: 'guildlogs_' }
            ]
            for (let i = 0; i < channelInfo.length; i++) {
                let channel = await message.guild.channels.create({
                    name: channelInfo[i].name,
                    type: 0,
                    parent: category.id,
                    permissionOverwrites: [{
                        id: message.guild.roles.everyone.id,
                        allow: [Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.ReadMessageHistory],
                        deny: [Discord.PermissionFlagsBits.ViewChannel],
                    }]
                })

                client.data.set(`${channelInfo[i].dbKey}${message.guild.id}`, channel.id)
                msg.edit({ content: `Création de la **catégorie** des logs Terminé` })
            }
        }
    }
}