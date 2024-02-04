const Discord = require('discord.js')
const ms = require('ms')

module.exports = {
    name: "partnerconf",
    category: "Gestion",
    description: "Configurer la vérification des partenariats",
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

        let msg = await message.channel.send({content: 'Chargement du module en cours . . .'});
        await embed(client, message, msg);
    }
}

async function embed(client, message, msg) {
    let db = await client.data.get(`partnerdata_${message.guild.id}`) || {
        partrole: [],
        notifrole: []
    }
    let color = parseInt(client.color.replace('#', ''), 16);
    msg.edit({
        content: null,
        embeds: [{
            title: 'Configurer le systeme des partenariats',
            color: color,
            footer: client.config.footer,
            timestamp: new Date(),
            fields: [{
                name: 'Role Partner',
                value: db?.partrole?.map((r) => `<@&${r}>`).join(" ") ? db?.partrole?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
            }, {
                name: 'Role Notification',
                value: db?.notifrole?.map((r) => `<@&${r}>`).join(" ") ? db?.notifrole?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
            }]
        }],
        components: [{
            type: 1,
            components: [{
                type: 3,
                custom_id: 'partnerconfig' + message.id,
                placeholder: 'Choisis une option',
                options: [{
                    label: 'Role Partner',
                    value: 'configpartrole'
                }, {
                    label: 'Role Notification',
                    value: 'confignotifrole'},{
                    label: 'Recharger',
                    value: 'refresh'
                }]
            }]
        }]
        })

    const collector = msg.createMessageComponentCollector({
        filter: (i) => i.user.id === message.author.id,
        time: 60000*10*3
    })
    collector.on("collect", async(i) => {
        const color = parseInt(client.color.replace("#", ""), 16)
        if(i.customId === 'back' + message.id){
            i.deferUpdate();
            msg.edit({
                content: null,
                embeds: [{
                    title: 'Configurer le systeme des partenariats',
                    color: color,
                    footer: client.config.footer,
                    timestamp: new Date(),
                    fields: [{
                        name: 'Role Partner',
                        value: db?.partrole?.map((r) => `<@&${r}>`).join(" ") ? db?.partrole?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
                    }, {
                        name: 'Role Notification',
                        value: db?.notifrole?.map((r) => `<@&${r}>`).join(" ") ? db?.notifrole?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
                    }]
                }],
                components: [{
                    type: 1,
                    components: [{
                        type: 3,
                        custom_id: 'partnerconfig' + message.id,
                        placeholder: 'Choisis une option',
                        options: [{
                            label: 'Role Partner',
                            value: 'configpartrole'
                        }, {
                            label: 'Role Notification',
                            value: 'confignotifrole'},{
                            label: 'Recharger',
                            value: 'refresh'
                        }
                    ]
                    }]
                }]
            })
        }

        if(i.customId === 'partnerconfig' + message.id) {
            i.deferUpdate();
            if (i.values[0] === 'configpartrole') {
                let db = await client.data.get(`partnerdata_${message.guild.id}`) || {
                    partrole: [],
                    notifrole: []
                }
                const salonrow = new Discord.ActionRowBuilder().addComponents(
                    new Discord.RoleSelectMenuBuilder()
                        .setCustomId('part_setup_role_' + message.id)
                        .setMaxValues(1)
                )
                let color = parseInt(client.color.replace('#', ''), 16);
                msg.edit({embeds: [{
                        title: 'Quels est le role a donner aux partenaires ?',
                        color: color,
                        footer: client.config.footer,
                        timestamp: new Date(),
                        description: 'Choisissez les roles',
                        fields: [
                            {
                                name: 'Role',
                                value: db?.partrole?.map((r) => `<@&${r}>`).join(" ") ? db?.partrole?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
                                inline: true
                            }
                        ]
                    }], components: [salonrow]})
            }

            if(i.values[0] === 'refresh') {
                msg.edit({
                    content: null,
                    embeds: [{
                        title: 'Configurer le systeme des partenariats',
                        color: color,
                        footer: client.config.footer,
                        timestamp: new Date(),
                        fields: [{
                            name: 'Role Partner',
                            value: db?.partrole?.map((r) => `<@&${r}>`).join(" ") ? db?.partrole?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
                        }, {
                            name: 'Role Notification',
                            value: db?.notifrole?.map((r) => `<@&${r}>`).join(" ") ? db?.notifrole?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
                        }]
                    }],
                    components: [{
                        type: 1,
                        components: [{
                            type: 3,
                            custom_id: 'partnerconfig' + message.id,
                            placeholder: 'Choisis une option',
                            options: [{
                                label: 'Role Partner',
                                value: 'configpartrole'
                            }, {
                                label: 'Role Notification',
                                value: 'confignotifrole'},{
                                label: 'Recharger',
                                value: 'refresh'
                            }
                            ]
                        }]
                    }]
                })
            }

            if (i.values[0] === 'confignotifrole') {
                let db = await client.data.get(`partnerdata_${message.guild.id}`) || {
                    partrole: [],
                    notifrole: []
                }
                const salonrow = new Discord.ActionRowBuilder().addComponents(
                    new Discord.RoleSelectMenuBuilder()
                        .setCustomId('notif_setup_role_' + message.id)
                        .setMaxValues(5)
                )
                let color = parseInt(client.color.replace('#', ''), 16);
                msg.edit({embeds: [{
                        title: 'Quels sont les roles a notifier pour les partenariats ?',
                        color: color,
                        footer: client.config.footer,
                        timestamp: new Date(),
                        description: 'Choisissez les roles',
                        fields: [
                            {
                                name: 'Role',
                                value: db?.notifrole?.map((r) => `<@&${r}>`).join(" ") ? db?.notifrole?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
                                inline: true
                            }
                        ]
                    }], components: [salonrow]})
            }
        }
    })


    client.on('interactionCreate', async (i) => {
        if (message.author.id === i.user.id) {
            if (i.customId === 'part_setup_role_' + message.id) {
                i.deferUpdate();
                let db = await client.data.get(`partnerdata_${message.guild.id}`) || {
                    partrole: [],
                    notifrole: []
                }
                let color = parseInt(client.color.replace('#', ''), 16);
                const rolee = i.values;
                if (db.hasOwnProperty('partrole')) {
                    db.partrole = rolee
                    await client.data.set(`partnerdata_${message.guild.id}`, db)
                } else {
                    await client.data.set(`partnerdata_${message.guild.id}`, db)
                }
                msg.edit({
                    content: null,
                    embeds: [{
                        title: 'Configurer le systeme des partenariats',
                        color: color,
                        footer: client.config.footer,
                        timestamp: new Date(),
                        fields: [{
                            name: 'Role Partner',
                            value: db?.partrole?.map((r) => `<@&${r}>`).join(" ") ? db?.partrole?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
                        }, {
                            name: 'Role Notification',
                            value: db?.notifrole?.map((r) => `<@&${r}>`).join(" ") ? db?.notifrole?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
                        }]
                    }],
                    components: [{
                        type: 1,
                        components: [{
                            type: 3,
                            custom_id: 'partnerconfig' + message.id,
                            placeholder: 'Choisis une option',
                            options: [{
                                label: 'Role Partner',
                                value: 'configpartrole'
                            }, {
                                label: 'Role Notification',
                                value: 'confignotifrole'},{
                                label: 'Recharger',
                                value: 'refresh'
                            }
                            ]
                        }]
                    }]
                })

            }

            if (i.customId === 'notif_setup_role_' + message.id) {
                i.deferUpdate();
                let db = await client.data.get(`partnerdata_${message.guild.id}`) || {
                    partrole: [],
                    notifrole: []
                }
                let color = parseInt(client.color.replace('#', ''), 16);
                const rolee = i.values;
                if (db.hasOwnProperty('notifrole')) {
                    db.notifrole = rolee
                    await client.data.set(`partnerdata_${message.guild.id}`, db)
                } else {
                    await client.data.set(`partnerdata_${message.guild.id}`, db)
                }
                msg.edit({
                    content: null,
                    embeds: [{
                        title: 'Configurer le systeme des partenariats',
                        color: color,
                        footer: client.config.footer,
                        timestamp: new Date(),
                        fields: [{
                            name: 'Role Partner',
                            value: db?.partrole?.map((r) => `<@&${r}>`).join(" ") ? db?.partrole?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
                        }, {
                            name: 'Role Notification',
                            value: db?.notifrole?.map((r) => `<@&${r}>`).join(" ") ? db?.notifrole?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
                        }]
                    }],
                    components: [{
                        type: 1,
                        components: [{
                            type: 3,
                            custom_id: 'partnerconfig' + message.id,
                            placeholder: 'Choisis une option',
                            options: [{
                                label: 'Role Partner',
                                value: 'configpartrole'
                            }, {
                                label: 'Role Notification',
                                value: 'confignotifrole'},{
                                label: 'Recharger',
                                value: 'refresh'
                            }
                            ]
                        }]
                    }]
                })

            }


        }
    })
}