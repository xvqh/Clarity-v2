import Discord from "discord.js";

export default {
    name: "prisonconfig",
    category: "Gestion",
    aliases: ['prisonconf', 'prisonc'],
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
    const db = await client.data.get(`prisondata_${message.guild.id}`) || {
        channel: null,
        role: [],
        status: false
    }
    let color = parseInt(client.color.replace('#', ''), 16);
    msg.edit({
        content: null,
        embeds: [{
            title: 'Configurer la vérification du serveur',
            color: color,
            footer: client.config.footer,
            timestamp: new Date(),
            fields: [{
                name: 'Role',
                value: db?.role?.map((r) => `<@&${r}>`).join(" ") ? db?.role?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
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
                    label: 'Role',
                    value: 'configrole'
                }]
            }]
        }, {
            type: 1,
            components: [{
                type: 2,
                label: "Dero-Serv",
                style: 2,
                custom_id: 'dero' + message.id
            }, {
                type: 2,
                style: 2,
                custom_id: 'setup' + message.id,
                label: 'Setup'
            }]
        }]
    })
    // collector
    const filter = (i) => i.user.id === message.author.id

    const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 * 10 * 3 })
    collector.on('collect', async i => {
        if (i.customId === 'verifconfig' + message.id) {
            i.deferUpdate();
            if (i.values[0] === 'configrole') {
                let db = await client.data.get(`prisondata_${message.guild.id}`) || {
                    channel: null,
                    role: [],
                    status: false
                }
                let color = parseInt(client.color.replace('#', ''), 16);
                const salonrow = new Discord.ActionRowBuilder().addComponents(
                    new Discord.RoleSelectMenuBuilder()
                        .setCustomId('verif_setup_role_' + message.id)
                        .setMaxValues(25)
                )
                msg.edit({
                    embeds: [{
                        title: 'Quels sont les roles a donner aux prisonniers',
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
            }
        }

        if (i.customId === 'dero' + message.id) {
            i.deferUpdate();
            let db = await client.data.get(`prisondata_${message.guild.id}`) || {
                channel: null,
                role: [],
                status: false
            }
            // recupere tout les channels du serveur appart le channel prison et interdit le role prison de les voirs
            let role = db.role;

            role.forEach(async (roleID) => {
                const role = message.guild.roles.cache.get(roleID);
                // modif tout les channels du serveur appart le channel prison et interdit le role prison de les voirs
                if (!role) {
                    db.role = db.role.filter((r) => r !== roleID);
                    client.data.set(`prisondata_${message.guild.id}`, db);
                    return;
                }
                if (role) {
                    let channels = message.guild.channels.cache;


                    channels.forEach(async (channel) => {
                        let category = message.guild.channels.cache.find((c) => c.name === `${message.guild.name}・PRISON`);
                        if (channel.parentId !== category.id) {
                            // edit channel
                            channel.permissionOverwrites.create(role, {
                                SendMessages: false,
                                AddReactions: false,
                                ViewChannel: false,
                                SendMessagesInThreads: false,
                                ReadMessageHistory: false,
                                Connect: false
                            })
                        }
                        if (channel.parentId === category.id) {

                            channel.permissionOverwrites.create(role, {
                                SendMessages: true,
                                AddReactions: true,
                                ViewChannel: true,
                                SendMessagesInThreads: true,
                                ReadMessageHistory: true,
                                Connect: true
                            })
                        }
                    })

                }
            })

        }

        if (i.customId === 'setup' + message.id) {
            i.deferUpdate();
            let db = await client.data.get(`prisondata_${message.guild.id}`) || {
                channel: null,
                role: [],
                status: false
            }
            let msg = await message.channel.send({ content: `Création de la **catégorie** prison en cours..` })
            // recupere le role de la prison qui est save ds la db
            let role = db.role;

            role.forEach(async (roleID) => {
                const role = message.guild.roles.cache.get(roleID);
                if (!role) {
                    db.role = db.role.filter((r) => r !== roleID);
                    client.data.set(`prisondata_${message.guild.id}`, db);
                    return;
                } else if (role) {
                    let category = await message.guild.channels.create({
                        name: `${message.guild.name}・PRISON`,
                        type: 4,
                        permissionOverwrites: [{
                            id: message.guild.roles.everyone.id,
                            allow: [Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.ReadMessageHistory],
                            deny: [Discord.PermissionFlagsBits.ViewChannel],
                        }, {
                            id: role.id,
                            allow: [Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.ReadMessageHistory, Discord.PermissionFlagsBits.ViewChannel],
                            deny: [],
                        }]
                    })
                    let channelInfo = [
                        { name: '🛡️・chat-prison', dbKey: 'chatprison_' },
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
                            }, {
                                id: role.id,
                                allow: [Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.ReadMessageHistory, Discord.PermissionFlagsBits.ViewChannel],
                                deny: [],
                            }]
                        })
                        client.data.set(`${channelInfo[i].dbKey}${message.guild.id}`, channel.id)
                        msg.edit({ content: `Création de la **catégorie** prison Terminé` })

                    }
                }
            })

        }
    })
    client.on('interactionCreate', async (i) => {
        if (message.author.id === i.user.id) {
            if (i.customId === 'verif_setup_role_' + message.id) {
                i.deferUpdate();
                let db = await client.data.get(`prisondata_${message.guild.id}`) || {
                    channel: null,
                    role: [],
                    status: false
                }
                let color = parseInt(client.color.replace('#', ''), 16);
                const rolee = i.values;
                if (db.hasOwnProperty('role')) {
                    db.role = rolee
                    client.data.set(`prisondata_${message.guild.id}`, db);
                } else {
                    client.data.set(`prisondata_${message.guild.id}`, db);
                }
                msg.edit({
                    content: null,
                    embeds: [{
                        title: 'Configurer la vérification du serveur',
                        color: color,
                        footer: client.config.footer,
                        timestamp: new Date(),
                        fields: [{
                            name: 'Role',
                            value: db?.role?.map((r) => `<@&${r}>`).join(" ") ? db?.role?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
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
                                label: 'Role',
                                value: 'configrole'
                            }]
                        }]
                    }, {
                        type: 1,
                        components: [{
                            type: 2,
                            label: "Dero-Serv",
                            style: 2,
                            custom_id: 'dero' + message.id
                        }, {
                            type: 2,
                            style: 2,
                            custom_id: 'setup' + message.id,
                            label: 'Setup'
                        }]
                    }]
                })
            }
            if (i.customId === 'back' + message.id) {
                i.deferUpdate();
                let db = await client.data.get(`prisondata_${message.guild.id}`) || {
                    channel: null,
                    role: [],
                    status: false,
                }
                let color = parseInt(client.color.replace('#', ''), 16);
                msg.edit({
                    content: null,
                    embeds: [{
                        title: 'Configurer la vérification du serveur',
                        color: color,
                        footer: client.config.footer,
                        timestamp: new Date(),
                        fields: [{
                            name: 'Role',
                            value: db?.role?.map((r) => `<@&${r}>`).join(" ") ? db?.role?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
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
                                label: 'Role',
                                value: 'configrole'
                            }]
                        }]
                    }, {
                        type: 1,
                        components: [{
                            type: 2,
                            label: "Dero-Serv",
                            style: 2,
                            custom_id: 'dero' + message.id
                        }, {
                            type: 2,
                            style: 2,
                            custom_id: 'setup' + message.id,
                            label: 'Setup'
                        }]
                    }]
                })
            }

        }
    });
}