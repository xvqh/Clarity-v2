import Discord from "discord.js";

export default {
    name: "presetpartner",
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

        if (!args[0]) return message.reply("Veuillez choisir un type de catégorie : \n`basic` ou `advanced`")

        if (args[0] == "advanced") {
            let msg = await message.channel.send({ content: `Création de la **catégorie** des partenariats en cours..` }).then(msg => {
                message.guild.channels.create({
                    name: `${message.guild.name}・Partner`,
                    type: 4,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: ["SendMessages"],
                            allow: ["ViewChannel"]
                        },
                    ],
                }).then(c => {
                    c.setPosition(0)
                    c.guild.channels.create({
                        name: "📌・Demande-partenariat",
                        type: 0,
                        parent: c.id,
                        permissionOverwrites: [
                            {
                                id: message.guild.id,
                                deny: [Discord.PermissionFlagsBits.SendMessages],
                                allow: [Discord.PermissionFlagsBits.ViewChannel]
                            },
                        ],
                    }).then(async (part) => {
                        client.data.set(`partnerask_${message.guild.id}`, part.id)
                        await part.send({
                            embeds: [{
                                title: "🤝・Partenariat",
                                description: `Pour demander un partenariat avec ${message.guild.name} veuillez ouvrir un ticket`,
                                color: parseInt(client.color.replace("#", ""), 16),
                                footer: client.config.footer
                            }], components: [{
                                type: 1,
                                components: [{
                                    type: 2,
                                    label: "Demander un partenariat",
                                    style: 2,
                                    custom_id: "partnerask",
                                    emoji: {
                                        name: "🤝",
                                    },
                                    disabled: false,
                                }]
                            }]
                        })
                        c.guild.channels.create({
                            name: "🤝・Partenariat",
                            type: 0,
                            parent: c.id,
                            permissionOverwrites: [
                                {
                                    id: message.guild.id,
                                    deny: [Discord.PermissionFlagsBits.SendMessages],
                                    allow: [Discord.PermissionFlagsBits.ViewChannel]
                                },
                            ],
                        }).then(newpart => {
                            client.data.set(`partnerlog_${message.guild.id}`, newpart.id)
                            newpart.send({
                                embeds: [{
                                    title: "🤝・Partenariat",
                                    description: `Ce salon sera utilisé pour envoyer les messages des demandes de partenaires qui ont été accepter`,
                                    color: parseInt(client.color.replace("#", ""), 16),
                                    footer: client.config.footer
                                }]
                            })
                        })
                    })
                })

                message.guild.channels.create({
                    name: `${message.guild.name}・Partner - Confirmation`,
                    type: 4,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: ["ViewChannel"],
                            allow: ["SendMessages"]
                        },
                    ],
                }).then(c => {
                    c.guild.channels.create({
                        name: '💎・Confirmation-Partenariat',
                        type: 0,
                        parent: c.id,
                        permissionOverwrites: [
                            {
                                id: message.guild.id,
                                deny: [Discord.PermissionFlagsBits.ViewChannel],
                                allow: [Discord.PermissionFlagsBits.SendMessages]
                            }
                        ]
                    }).then(sub => {
                        client.data.set(`partnerconfirm_${message.guild.id}`, sub.id)
                        sub.send({
                            embeds: [{
                                author: {
                                    name: `${message.guild.name} Partenariat`,
                                    icon_url: message.guild.iconURL({ dynamic: true }),
                                },
                                description: `Pour confirmer une demande de partenariat veuillez cliquer sur le bouton`,
                                color: parseInt(client.color.replace("#", ""), 16),
                                footer: client.config.footer
                            }],
                            components: [{
                                type: 1,
                                components: [{
                                    type: 2,
                                    label: "Confirmer la demande",
                                    style: 2,
                                    custom_id: "partner_accept",
                                    emoji: {
                                        name: "✅",
                                    },
                                    disabled: false,
                                }]
                            }]
                        })
                    })
                })


                message.guild.channels.create({
                    name: `${message.guild.name}・Partner - Ask`,
                    type: 4,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: ["ViewChannel"],
                            allow: ["SendMessages"]
                        },
                    ],
                }).then(c => {
                    c.guild.channels.create({
                        name: '💎・Attente-Partenariat',
                        type: 0,
                        parent: c.id,
                        permissionOverwrites: [
                            {
                                id: message.guild.id,
                                deny: [Discord.PermissionFlagsBits.ViewChannel],
                                allow: [Discord.PermissionFlagsBits.SendMessages]
                            }
                        ]
                    }).then(sub => {
                        client.data.set(`partnerwait_${message.guild.id}`, sub.id)
                        sub.send({
                            embeds: [{
                                author: {
                                    name: `${message.guild.name} Partenariat`, icon_url: message.guild.iconURL({ dynamic: true }),
                                },
                                description: `Toutes les demandes de partenariat pour le serveur: ${message.guild.name} arriveront dans ce channel`,
                                color: parseInt(client.color.replace("#", ""), 16),
                                footer: client.config.footer
                            }]
                        })
                    })
                })
            })
            message.author.send({
                embeds: [{
                    author: {
                        name: `${message.guild.name} Partenariat`, icon_url: message.guild.iconURL({ dynamic: true }),
                    },
                    description: `La configuration des partenariats que vous avez demandé est terminer sur le serveur: ${message.guild.name}`,
                    color: parseInt(client.color.replace("#", ""), 16),
                    footer: client.config.footer
                }]
            })
        }
        else if (args[0] == "basic") {

            let msg = await message.channel.send({ content: `Création de la **catégorie** des partenariats en cours..` }).then(msg => {
                message.guild.channels.create({
                    name: `${message.guild.name}・Partner`,
                    type: 4,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: ["SendMessages"],
                            allow: ["ViewChannel"]
                        },
                    ],
                }).then(c => {
                    c.setPosition(0)
                    c.guild.channels.create({
                        name: "🤝・Partenariat",
                        type: 0,
                        parent: c.id,
                        permissionOverwrites: [
                            {
                                id: message.guild.id,
                                deny: [Discord.PermissionFlagsBits.SendMessages],
                                allow: [Discord.PermissionFlagsBits.ViewChannel]
                            },
                        ],
                    }).then(newpart => {
                        client.data.set(`partnerlog_${message.guild.id}`, newpart.id)
                    })
                })
            })
            message.author.send({
                embeds: [{
                    author: {
                        name: `${message.guild.name} Partenariat`,
                        icon_url: message.guild.iconURL({ dynamic: true }),
                    },
                    description: `La configuration des partenariats que vous avez demandé est terminer sur le serveur: ${message.guild.name}`,
                    color: parseInt(client.color.replace("#", ""), 16),
                    footer: client.config.footer
                }]
            })
        }
    }
}