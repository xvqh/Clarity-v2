module.exports = {
    name: "raidmode",
    category: "Anti-raid",
    run: async (client, message, args) => {
        if(client.config.devs.includes(message.author.id)) {
            let msg  = await message.channel.send({
                content: "Module en cours de chargement . . . "
            })
            await update(client, message, msg)
        } else {
           const isOwn = await client.db.oneOrNone(
            `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
            [message.author.id]
        );
        if (!isOwn) {
            return message.reply({
                content: "Vous n'avez pas la permission d'utiliser cette commande",
            });
        }
            let msg  = await message.channel.send({
                content: "Module en cours de chargement . . . "
            })
            await update(client, message, msg)
        }
    }
}

async function update(client, message, msg) {
    // get raidmode_counter data
    const raidmodeCounter = client.data.get(`raidmode_counter_${message.guild.id}`);
    let db = client.data.get(`raidmode_${message.guild.id}`) || {
        status: false,
        message: null,
        logs: null
    }
    msg.edit({
        content: null,
        embeds: [{
            title: 'Raid-Mode',
            color: parseInt(client.color.replace("#", ""), 16),
            footer: client.config.footer,
            fields: [{
                name: 'Statut',
                value: db?.status ? '✅ Activer' : '❌ Désactiver',
                inline: true
            }, {
                name: 'Message',
                value: `${`${db?.message ?   db?.message : 'Raid Mode Activer'}`}`,
                inline: true
            }, {
                name: 'Logs',
                value: `${`${message.guild.channels.cache.get(db?.logs) ? message.guild.channels.cache.get(db?.logs) : 'Non Configurer'}`}`  ,
                inline: true
            }, {
                name: 'Nombre de tentative de joins lors du Raid-Mode',
                value: `${`${raidmodeCounter? raidmodeCounter : 0}`}` ,
                inline: true
            }]
        }],
        components: [{
            type: 1,
            components: [{
                type: 2,
                custom_id: 'status' + message.id,
                label: 'Status',
                style: db?.status ? 3 : 4
            }, {
                type: 2,
                custom_id: 'message' + message.id,
                label: 'Message',
                style: 1
            }, {
                type: 2,
                custom_id: 'logs' + message.id,
                label: 'Logs',
                style: 1
            }]
        }]
    })
    const collector = msg.createMessageComponentCollector({
        filter: (i) => i.user.id === message.author.id
    })
    collector.on('collect', async(i) => {
        i.deferUpdate()
        if (i.customId === 'status' + message.id){
            let db = await client.data.get(`raidmode_${message.guild.id}`) || {
                status: false,
                message: null,
                logs: null
            }
            if(db.hasOwnProperty('status')){
                const currentStatus = db.status;
                const newStatus = !currentStatus;
                db.status = newStatus;
                await client.data.set(`raidmode_${message.guild.id}`, db)
                const status = db?.status === true ? "Le status a été activé avec succès" : "Le status a été désactivé avec succès";

                const reply = await message.reply({ content: status, ephemeral: true });
                setTimeout(async () => {
                    await reply.delete();
                }, 2000);
                msg.edit({
                    content: null,
                    embeds: [{
                        title: 'Raid-Mode',
                        color: parseInt(client.color.replace("#", ""), 16),
                        footer: client.config.footer,
                        fields: [{
                            name: 'Statut',
                            value: db?.status ? '✅ Activer' : '❌ Désactiver',
                            inline: true
                        }, {
                            name: 'Message',
                            value: `${db?.message ?   db?.message : 'Raid Mode Activer'}`,
                            inline: true
                        }, {
                            name: 'Logs',
                            value: `${message.guild.channels.cache.get(db?.logs) ? message.guild.channels.cache.get(db?.logs) : 'Non Configurer'}`  ,
                            inline: true
                        }, {
                            name: 'Nombre de tentative de joins lors du Raid-Mode',
                            value: `${`${raidmodeCounter? raidmodeCounter : 0}`}` ,
                            inline: true}
                        ]
                    }],
                    components: [{
                        type: 1,
                        components: [{
                            type: 2,
                            custom_id: 'status' + message.id,
                            label: 'Status',
                            style: db?.status ? 3 : 4
                        }, {
                            type: 2,
                            custom_id: 'message' + message.id,
                            label: 'Message',
                            style: 1
                        }, {
                            type: 2,
                            custom_id: 'logs' + message.id,
                            label: 'Logs',
                            style: 1
                        }]
                    }]
                })
            }
        }
        if (i.customId === 'message' + message.id){
            let db = await client.data.get(`raidmode_${message.guild.id}`) || {
                status: false,
                message: null,
                logs: null
            }
            if(db.hasOwnProperty('message')){
                const reply = await message.reply({ content: 'Entrez le message', ephemeral: true });
                const filter = m => m.author.id === message.author.id;
                const collector = reply.channel.createMessageCollector({ filter, max: 1, time: 10000 });
                collector.on('collect', async(m) => {
                    db.message = m.content;
                    await client.data.set(`raidmode_${message.guild.id}`, db)
                    await reply.delete();
                    await m.delete();
                    collector.stop();
                    msg.edit({
                        content: null,
                        embeds: [{
                            title: 'Raid-Mode',
                            color: parseInt(client.color.replace("#", ""), 16),
                            footer: client.config.footer,
                            fields: [{
                                name: 'Statut',
                                value: db?.status ? '✅ Activer' : '❌ Désactiver',
                                inline: true
                            }, {
                                name: 'Message',
                                value: `${db?.message ?   db?.message : 'Raid Mode Activer'}`,
                                inline: true
                            }, {
                                name: 'Logs',
                                value: `${message.guild.channels.cache.get(db?.logs) ? message.guild.channels.cache.get(db?.logs) : 'Non Configurer'}`  ,
                                inline: true
                            }, {
                                name: 'Nombre de tentative de joins lors du Raid-Mode',
                                value: `${`${raidmodeCounter? raidmodeCounter : 0}`}` ,
                                inline: true}]
                        }],
                        components: [{
                            type: 1,
                            components: [{
                                type: 2,
                                custom_id: 'status' + message.id,
                                label: 'Status',
                                style: db?.status ? 3 : 4
                            }, {
                                type: 2,
                                custom_id: 'message' + message.id,
                                label: 'Message',
                                style: 1
                            }, {
                                type: 2,
                                custom_id: 'logs' + message.id,
                                label: 'Logs',
                                style: 1
                            }]

                        }]
                    })
                })
            }
        }
        if (i.customId === 'logs' + message.id) {
            msg.edit({
                components: [{
                    type: 1,
                    components : [{
                        custom_id: 'logsc' + message.id,
                        type: 8,
                        label: 'Logs',
                        value: 'Logs'
                    }]
                }]
            })
        }
    })
    client.on('interactionCreate', async (i) => {
        if(i.customId === 'logsc' + message.id) {
            let db = await client.data.get(`raidmode_${message.guild.id}`) || {
                status: false,
                message: null,
                logs: null
            }
        
            const channel = i.values[0];

            if(db.hasOwnProperty('logs')){
                db.logs = channel;
                client.data.set(`raidmode_${message.guild.id}`, db)
            } else {
                client.data.set(`raidmode_${message.guild.id}`, db)
            }
            msg.edit({
                content: null,
                embeds: [{
                    title: 'Raid-Mode',
                    color: parseInt(client.color.replace("#", ""), 16),
                    footer: client.config.footer,
                    fields: [{
                        name: 'Statut',
                        value: db?.status ? '✅ Activer' : '❌ Désactiver',
                        inline: true
                    }, {
                        name: 'Message',
                        value: `${db?.message ?   db?.message : 'Raid Mode Activer'}`,
                        inline: true
                    }, {
                        name: 'Logs',
                        value: `${message.guild.channels.cache.get(db?.logs) ? message.guild.channels.cache.get(db?.logs) : 'Non Configurer'}`  ,
                        inline: true
                    }, {
                        name: 'Nombre de tentative de joins lors du Raid-Mode',
                        value: `${`${raidmodeCounter? raidmodeCounter : 0}`}` ,
                        inline: true}]
                }],
                components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        custom_id: 'status' + message.id,
                        label: 'Status',
                        style: db?.status ? 3 : 4
                    }, {
                        type: 2,
                        custom_id: 'message' + message.id,
                        label: 'Message',
                        style: 1
                    }, {
                        type: 2,
                        custom_id: 'logs' + message.id,
                        label: 'Logs',
                        style: 1
                    }]

                }]
            })
        }
    })
}