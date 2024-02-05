import Discord from "discord.js";
import ms from 'ms';

export default {
    name: "verifconfig",
    category: "Gestion",
    aliases: ['verifc', 'verif'],
    description: "Configurer la vérification du serveur",
    run: async (client, message) => {
        const isOwn = await client.db.oneOrNone(
            `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
            [message.author.id]
        );
        if (!isOwn) {
            return message.reply({
                content: "Vous n'avez pas la permission d'utiliser cette commande",
            });
        }
        let msg = await message.channel.send({ content: 'Chargement du module en cours . . .' });
        await embed(client, message, msg);
    }
}
async function embed(client, message, msg) {
    const db = await client.data.get(`verifdata_${message.guild.id}`) || {
        channel: null,
        role: [],
        status: false,
        emoji: '✅',
        messageid: null,
        text: null,
    }
    let color = parseInt(client.color.replace('#', ''), 16);
    msg.edit({
        content: null,
        embeds: [{
            title: 'Configurer la vérification du serveur',
            color: color,
            footer: client.config.footer,
            timestamp: new Date(),
            fields: [
                {
                    name: 'Channel',
                    value: `${client.channels.cache.get(db.channel) ? client.channels.cache.get(db.channel) : 'Aucun'}`,
                    inline: true
                }, {
                    name: 'Role',
                    value: db?.role?.map((r) => `<@&${r}>`).join(" ") ? db?.role?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
                    inline: true
                }, {
                    name: 'Message',
                    value: `${db.message ? db.message : 'Message Automatique'}`,
                    inline: true
                }, {
                    name: 'Emoji du bouton',
                    value: `${db.emoji ? db.emoji : 'Aucun'}`,
                    inline: true
                }, {
                    name: 'Text du bouton',
                    value: `${db.text ? db.text : 'Aucun'}`,
                    inline: true
                }, {
                    name: 'Statut',
                    value: db?.status ? '✅ Activer' : '❌ Désactiver',
                    inline: true
                }
            ]
        }], components: [{
            type: 1,
            components: [{
                type: 3,
                custom_id: 'verifconfig' + message.id,
                placeholder: 'Choisis une option',
                options: [{
                    label: 'Channel',
                    value: 'configchan'
                }, {
                    label: 'Role',
                    value: 'configrole'
                }, {
                    label: 'Bouton',
                    value: 'configbouton'
                }, {
                    label: 'Confirmer',
                    value: 'configsubmit'
                }]
            }]
        }, {
            type: 1,
            components: [{
                type: 2,
                label: "Status",
                style: 2,
                custom_id: 'verifstatus' + message.id
            }]
        }]
    })
    // collector 
    const filter = (i) => i.user.id === message.author.id

    const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 * 10 * 3 })
    collector.on('collect', async i => {
        if (i.customId === 'verifconfig' + message.id) {
            i.deferUpdate();
            if (i.values[0] === 'configchan') {
                let db = await client.data.get(`verifdata_${message.guild.id}`) || {
                    channel: null,
                    role: [],
                    status: false,
                    emoji: '✅',
                    messageid: null,
                    text: null,
                }
                let color = parseInt(client.color.replace('#', ''), 16);
                const filter = response => response.author.id === message.author.id;
                const sentMessage = await i.reply("Quel est le **salon **du systeme de verification ?");
                try {
                    const collected = await message.channel.awaitMessages({ filter, max: 1, time: ms("1m"), errors: ['time'] });
                    const msgcollect = collected.first().content.trim();
                    const channelID = msgcollect.replace(/[<#>]/g, '') || msgcollect;
                    const channel = message.guild.channels.cache.get(channelID);
                    if (!channel) {
                        message.channel.send("Aucun channel trouvé.");
                        await sentMessage.delete();
                        await collected.first().delete();
                        await msg.edit({
                            content: null,
                            embeds: [{
                                title: 'Configurer la vérification du serveur',
                                color: color,
                                footer: client.config.footer,
                                timestamp: new Date(),
                                fields: [
                                    {
                                        name: 'Channel',
                                        value: `${client.channels.cache.get(db.channel) ? client.channels.cache.get(db.channel) : 'Aucun'}`,
                                        inline: true
                                    }, {
                                        name: 'Role',
                                        value: db?.role?.map((r) => `<@&${r}>`).join(" ") ? db?.role?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
                                        inline: true
                                    }, {
                                        name: 'Message',
                                        value: `${db.message ? db.message : 'Message Automatique'}`,
                                        inline: true
                                    }, {
                                        name: 'Emoji du bouton',
                                        value: `${db.emoji ? db.emoji : 'Aucun'}`,
                                        inline: true
                                    }, {
                                        name: 'Text du bouton',
                                        value: `${db.text ? db.text : 'Aucun'}`,
                                        inline: true
                                    }, {
                                        name: 'Statut',
                                        value: db?.status ? '✅ Activer' : '❌ Désactiver',
                                        inline: true
                                    }
                                ]
                            }]
                        })
                    } else {
                        db.channel = channel.id;
                        await client.data.set(`verifdata_${message.guild.id}`, db);
                        await sentMessage.delete();
                        await collected.first().delete();
                        await msg.edit({
                            content: null,
                            embeds: [{
                                title: 'Configurer la vérification du serveur',
                                color: color,
                                footer: client.config.footer,
                                timestamp: new Date(),
                                fields: [
                                    {
                                        name: 'Channel',
                                        value: `${client.channels.cache.get(db.channel) ? client.channels.cache.get(db.channel) : 'Aucun'}`,
                                        inline: true
                                    }, {
                                        name: 'Role',
                                        value: db?.role?.map((r) => `<@&${r}>`).join(" ") ? db?.role?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
                                        inline: true
                                    }, {
                                        name: 'Emoji du bouton',
                                        value: `${db.emoji ? db.emoji : 'Aucun'}`,
                                        inline: true
                                    }, {
                                        name: 'Text du bouton',
                                        value: `${db.text ? db.text : 'Aucun'}`,
                                        inline: true
                                    }, {
                                        name: 'Statut',
                                        value: db?.status ? '✅ Activer' : '❌ Désactiver',
                                        inline: true
                                    }
                                ]
                            }]
                        })
                    }
                } catch (e) {
                    console.log(e)
                }
            } else if (i.values[0] === 'configrole') {
                let db = await client.data.get(`verifdata_${message.guild.id}`) || {
                    channel: null,
                    role: [],
                    status: false,
                    emoji: '✅',
                    messageid: null,
                    text: null,
                }
                let color = parseInt(client.color.replace('#', ''), 16);
                const salonrow = new Discord.ActionRowBuilder().addComponents(
                    new Discord.RoleSelectMenuBuilder()
                        .setCustomId('verif_setup_role_' + message.id)
                        .setMaxValues(25)
                )
                msg.edit({
                    embeds: [{
                        title: 'Quels sont les roles a donner apres la verification',
                        color: color,
                        footer: client.config.footer,
                        timestamp: new Date(),
                        description: 'Choisissez les roles',
                        fields: [
                            {
                                name: 'Role',
                                value: db?.role?.map((r) => `<@&${r}>`).join(" ") ? db?.role?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
                                inline: true
                            }
                        ]
                    }], components: [salonrow]
                })
            } else if (i.values[0] === 'configbouton') {
                let db = await client.data.get(`verifdata_${message.guild.id}`) || {
                    channel: null,
                    role: [],
                    status: false,
                    emoji: '✅',
                    messageid: null,
                    text: null,
                }
                let color = parseInt(client.color.replace('#', ''), 16);
                await msg.edit({
                    content: null,
                    embeds: [{
                        title: 'Configurer la vérification du serveur',
                        color: color,
                        footer: client.config.footer,
                        timestamp: new Date(),
                        fields: [
                            {
                                name: 'Channel',
                                value: `${client.channels.cache.get(db.channel) ? client.channels.cache.get(db.channel) : 'Aucun'}`,
                                inline: true
                            }, {
                                name: 'Role',
                                value: db?.role?.map((r) => `<@&${r}>`).join(" ") ? db?.role?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
                                inline: true
                            }, {
                                name: 'Message',
                                value: `${db.message ? db.message : 'Message Automatique'}`,
                                inline: true
                            }, {
                                name: 'Emoji du bouton',
                                value: `${db.emoji ? db.emoji : 'Aucun'}`,
                                inline: true
                            }, {
                                name: 'Text du bouton',
                                value: `${db.text ? db.text : 'Aucun'}`,
                                inline: true
                            }, {
                                name: 'Statut',
                                value: db?.status ? '✅ Activer' : '❌ Désactiver',
                                inline: true
                            }
                        ]
                    }], components: [{
                        type: 1,
                        components: [{
                            type: 2,
                            style: 1,
                            label: 'Modifier le texte du bouton',
                            customId: 'veriftext' + message.id
                        }, {
                            type: 2,
                            style: 1,
                            label: 'Modifier l\'emoji du bouton',
                            customId: 'verifemoji' + message.id
                        }, {
                            type: 2,
                            style: 1,
                            label: 'Retour',
                            customId: 'back' + message.id
                        }]
                    }]
                })
            } else if (i.values[0] === 'configsubmit') {
                let db = await client.data.get(`verifdata_${message.guild.id}`) || {
                    channel: null,
                    role: [],
                    status: false,
                    emoji: '✅',
                    messageid: null,
                    text: null,
                }
                let color = parseInt(client.color.replace('#', ''), 16);
                if (!db.channel || !db.role) {
                    return i.reply({
                        content: 'Veuillez configurer le channel et les roles',
                        ephemeral: true
                    })
                }
                const channel = client.channels.cache.get(db.channel)
                if (!channel) {
                    return i.reply({
                        content: 'Veuillez configurer le channel',
                        ephemeral: true
                    })
                } else {
                    const buttons = [];
                    const button = new Discord.ButtonBuilder()
                        .setStyle(2)
                        .setLabel(db.text)
                        .setEmoji(db.emoji)
                        .setCustomId(`verif`);

                    buttons.push(button);
                    const embed = new Discord.EmbedBuilder()
                        .setTitle('Verification')
                        .setDescription(message.guild.name + ' verif anti bot/anti token')
                        .setColor(color)
                        .setFooter(client.config.footer)
                    const row = new Discord.ActionRowBuilder().addComponents(...buttons);
                    channel.send({ embeds: [embed], components: [row] })
                    msg.edit({ components: [] })
                }
            }
        }
        if (i.customId === 'verifstatus' + message.id) {
            i.deferUpdate();
            let db = await client.data.get(`verifdata_${message.guild.id}`) || {
                channel: null,
                role: [],
                status: false,
                emoji: '✅',
                messageid: null,
                text: null,
            }
            let color = parseInt(client.color.replace('#', ''), 16);
            if (db.hasOwnProperty('status')) {
                const currentStatus = db.status;
                const newStatus = !currentStatus;
                db.status = newStatus;
                client.data.set(`verifdata_${message.guild.id}`, db);
                const status = db?.status === true ? "Le status a été activé avec succès" : "Le status a été désactivé avec succès";

                const reply = await message.reply({ content: status, ephemeral: true });
                setTimeout(async () => {
                    await reply.delete();
                }, 2000);
                msg.edit({
                    content: null,
                    embeds: [{
                        title: 'Configurer la vérification du serveur',
                        color: color,
                        footer: client.config.footer,
                        timestamp: new Date(),
                        fields: [
                            {
                                name: 'Channel',
                                value: `${client.channels.cache.get(db.channel) ? client.channels.cache.get(db.channel) : 'Aucun'}`,
                                inline: true
                            }, {
                                name: 'Role',
                                value: db?.role?.map((r) => `<@&${r}>`).join(" ") ? db?.role?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
                                inline: true
                            }, {
                                name: 'Message',
                                value: `${db.message ? db.message : 'Message Automatique'}`,
                                inline: true
                            }, {
                                name: 'Emoji du bouton',
                                value: `${db.emoji ? db.emoji : 'Aucun'}`,
                                inline: true
                            }, {
                                name: 'Text du bouton',
                                value: `${db.text ? db.text : 'Aucun'}`,
                                inline: true
                            }, {
                                name: 'Statut',
                                value: db?.status ? '✅ Activer' : '❌ Désactiver',
                                inline: true
                            }
                        ]
                    }]
                })
            }

        }
    })
    client.on('interactionCreate', async (i) => {
        if (message.author.id === i.user.id) {
            if (i.customId === 'verif_setup_role_' + message.id) {
                i.deferUpdate();
                let db = await client.data.get(`verifdata_${message.guild.id}`) || {
                    channel: null,
                    role: [],
                    status: false,
                    emoji: '✅',
                    messageid: null,
                    text: null,
                }
                let color = parseInt(client.color.replace('#', ''), 16);
                const rolee = i.values;
                if (db.hasOwnProperty('role')) {
                    db.role = rolee
                    client.data.set(`verifdata_${message.guild.id}`, db);
                } else {
                    client.data.set(`verifdata_${message.guild.id}`, db);
                }
                msg.edit({
                    content: null,
                    embeds: [{
                        title: 'Configurer la vérification du serveur',
                        color: color,
                        footer: client.config.footer,
                        timestamp: new Date(),
                        fields: [
                            {
                                name: 'Channel',
                                value: `${client.channels.cache.get(db.channel) ? client.channels.cache.get(db.channel) : 'Aucun'}`,
                                inline: true
                            }, {
                                name: 'Role',
                                value: db?.role?.map((r) => `<@&${r}>`).join(" ") ? db?.role?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
                                inline: true
                            }, {
                                name: 'Message',
                                value: `${db.message ? db.message : 'Message Automatique'}`,
                                inline: true
                            }, {
                                name: 'Emoji du bouton',
                                value: `${db.emoji ? db.emoji : 'Aucun'}`,
                                inline: true
                            }, {
                                name: 'Text du bouton',
                                value: `${db.text ? db.text : 'Aucun'}`,
                                inline: true
                            }, {
                                name: 'Statut',
                                value: db?.status ? '✅ Activer' : '❌ Désactiver',
                                inline: true
                            }
                        ]
                    }], components: [{
                        type: 1,
                        components: [{
                            type: 3,
                            custom_id: 'verifconfig' + message.id,
                            options: [{
                                label: 'Channel',
                                value: 'configchan'
                            }, {
                                label: 'Role',
                                value: 'configrole'
                            }, {
                                label: 'Bouton',
                                value: 'configbouton'
                            }, {
                                label: 'Confirmer',
                                value: 'configsubmit'
                            }]
                        }]
                    }, {
                        type: 1,
                        components: [{
                            type: 2,
                            label: "Status",
                            style: 2,
                            custom_id: 'verifstatus' + message.id
                        }]
                    }]
                })
            }
            if (i.customId === 'veriftext' + message.id) {
                i.deferUpdate();
                let db = await client.data.get(`verifdata_${message.guild.id}`) || {
                    channel: null,
                    role: [],
                    status: false,
                    emoji: '✅',
                    messageid: null,
                    text: null,
                }

                const filter = response => response.author.id === message.author.id;
                const sentMessage = await message.reply("Quel est le **text **du systeme de verification ?");
                try {
                    const collected = await message.channel.awaitMessages({ filter, max: 1, time: ms("1m"), errors: ['time'] });
                    const msgcollect = collected.first().content.trim();
                    db.text = msgcollect
                    await client.data.set(`verifdata_${message.guild.id}`, db);
                    let color = parseInt(client.color.replace('#', ''), 16);
                    await sentMessage.delete();
                    await collected.first().delete();
                    await msg.edit({
                        content: null,
                        embeds: [{
                            title: 'Configurer la vérification du serveur',
                            color: color,
                            footer: client.config.footer,
                            timestamp: new Date(),
                            fields: [
                                {
                                    name: 'Channel',
                                    value: `${client.channels.cache.get(db.channel) ? client.channels.cache.get(db.channel) : 'Aucun'}`,
                                    inline: true
                                }, {
                                    name: 'Role',
                                    value: db?.role?.map((r) => `<@&${r}>`).join(" ") ? db?.role?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
                                    inline: true
                                }, {
                                    name: 'Message',
                                    value: `${db.message ? db.message : 'Message Automatique'}`,
                                    inline: true
                                }, {
                                    name: 'Emoji du bouton',
                                    value: `${db.emoji ? db.emoji : 'Aucun'}`,
                                    inline: true
                                }, {
                                    name: 'Text du bouton',
                                    value: `${db.text ? db.text : 'Aucun'}`,
                                    inline: true
                                }, {
                                    name: 'Statut',
                                    value: db?.status ? '✅ Activer' : '❌ Désactiver',
                                    inline: true
                                }
                            ]
                        }], components: [{
                            type: 1,
                            components: [{
                                type: 2,
                                style: 1,
                                label: 'Modifier le texte du bouton',
                                customId: 'veriftext' + message.id
                            }, {
                                type: 2,
                                style: 1,
                                label: 'Modifier l\'emoji du bouton',
                                customId: 'verifemoji' + message.id
                            }, {
                                type: 2,
                                style: 1,
                                label: 'Retour',
                                customId: 'back' + message.id
                            }]
                        }]
                    })
                } catch (e) {
                    return console.log(e)
                }

            }
            if (i.customId === 'verifemoji' + message.id) {
                i.deferUpdate();
                let db = await client.data.get(`verifdata_${message.guild.id}`) || {
                    channel: null,
                    role: [],
                    status: false,
                    emoji: '✅',
                    messageid: null,
                    text: null,
                }

                const filter = response => response.author.id === message.author.id;
                const sentMessage = await message.reply("Quel est l\'**emoji **du systeme de verification ?");
                try {
                    const collected = await message.channel.awaitMessages({ filter, max: 1, time: ms("1m"), errors: ['time'] });
                    const emojiInput = collected.first().content.trim();
                    let emojiName;
                    if (emojiInput.startsWith('<:') && emojiInput.endsWith('>')) {
                        emojiName = emojiInput.match(/:(.*):/)[1];
                    } else {
                        emojiName = emojiInput;
                    }
                    if (db.hasOwnProperty('emoji')) {
                        db.emoji = emojiInput;
                        client.data.set(`verifdata_${message.guild.id}`, db);
                        let color = parseInt(client.color.replace('#', ''), 16);
                        await sentMessage.delete();
                        await collected.first().delete();
                        await msg.edit({
                            content: null,
                            embeds: [{
                                title: 'Configurer la vérification du serveur',
                                color: color,
                                footer: client.config.footer,
                                timestamp: new Date(),
                                fields: [
                                    {
                                        name: 'Channel',
                                        value: `${client.channels.cache.get(db.channel) ? client.channels.cache.get(db.channel) : 'Aucun'}`,
                                        inline: true
                                    }, {
                                        name: 'Role',
                                        value: db?.role?.map((r) => `<@&${r}>`).join(" ") ? db?.role?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
                                        inline: true
                                    }, {
                                        name: 'Message',
                                        value: `${db.message ? db.message : 'Message Automatique'}`,
                                        inline: true
                                    }, {
                                        name: 'Emoji du bouton',
                                        value: `${db.emoji ? db.emoji : 'Aucun'}`,
                                        inline: true
                                    }, {
                                        name: 'Text du bouton',
                                        value: `${db.text ? db.text : 'Aucun'}`,
                                        inline: true
                                    }, {
                                        name: 'Statut',
                                        value: db?.status ? '✅ Activer' : '❌ Désactiver',
                                        inline: true
                                    }
                                ]
                            }]
                        })
                    }
                }
                catch (err) {
                    return console.log(err)
                }
            }
            if (i.customId === 'back' + message.id) {
                i.deferUpdate();
                let db = await client.data.get(`verifdata_${message.guild.id}`) || {
                    channel: null,
                    role: [],
                    status: false,
                    emoji: '✅',
                    messageid: null,
                    text: null,
                }
                let color = parseInt(client.color.replace('#', ''), 16);
                msg.edit({
                    content: null,
                    embeds: [{
                        title: 'Configurer la vérification du serveur',
                        color: color,
                        footer: client.config.footer,
                        timestamp: new Date(),
                        fields: [
                            {
                                name: 'Channel',
                                value: `${client.channels.cache.get(db.channel) ? client.channels.cache.get(db.channel) : 'Aucun'}`,
                                inline: true
                            }, {
                                name: 'Role',
                                value: db?.role?.map((r) => `<@&${r}>`).join(" ") ? db?.role?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
                                inline: true
                            }, {
                                name: 'Message',
                                value: `${db.message ? db.message : 'Message Automatique'}`,
                                inline: true
                            }, {
                                name: 'Emoji du bouton',
                                value: `${db.emoji ? db.emoji : 'Aucun'}`,
                                inline: true
                            }, {
                                name: 'Text du bouton',
                                value: `${db.text ? db.text : 'Aucun'}`,
                                inline: true
                            }, {
                                name: 'Statut',
                                value: db?.status ? '✅ Activer' : '❌ Désactiver',
                                inline: true
                            }
                        ]
                    }], components: [{
                        type: 1,
                        components: [{
                            type: 3,
                            custom_id: 'verifconfig' + message.id,
                            options: [{
                                label: 'Channel',
                                value: 'configchan'
                            }, {
                                label: 'Role',
                                value: 'configrole'
                            }, {
                                label: 'Bouton',
                                value: 'configbouton'
                            }, {
                                label: 'Confirmer',
                                value: 'configsubmit'
                            }]
                        }]
                    }, {
                        type: 1,
                        components: [{
                            type: 2,
                            label: "Status",
                            style: 2,
                            custom_id: 'verifstatus' + message.id
                        }]
                    }]
                })
            }
        }
    });
}