module.exports = {
    name: 'showpic',
    category: 'Gestion',
    run: async(client, message, args) => {
        if (client.config.devs.includes(message.author.id)) {
            let msg = await message.channel.send({content: 'Module en cours de chargement. . .'})
            await update(client, msg, message)
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
        let msg = await message.channel.send({content: 'Chargement du module en cours. . .'})
        await update(client, msg, message)
        }
    }
}

async function update(client, msg, message) {
    let data = await client.data.get(`showpic_${message.guild.id}`) || { 
        status: false,
        pfp: null,
        bfp: null,
    }
    msg.edit({
        content: null,
        embeds: [{
            title: message.guild.name + " " + "ShowPic",
            footer:  {text: client.config.footer.text},
            color: parseInt(client.color.replace("#", ""), 16),
            timestamp: new Date().toISOString(),
            fields: [{
                name: 'Statut',
                value: data.status? '✅ Activer' : '❌ Désactiver',
                inline: true
            }, {
                name: 'PFP',
                value: `${message.guild.channels.cache.get(data?.pfp) ? message.guild.channels.cache.get(data?.pfp) : 'Non Configurer'}`,
                inline: true
            }, {
                name: 'BFP',
                value: `${message.guild.channels.cache.get(data?.bfp) ? message.guild.channels.cache.get(data?.bfp) : 'Non Configurer'}`,
                inline: true
            }]
        }],components: [{
            type: 1,
            components: [{
                type: 3,
                custom_id: 'showpic' + message.id,
                placeholder: 'Choisis une option',
                options: [{
                    label: 'Salon PFP',
                    value: 'configpfp'
                }, {
                    label: 'Salon BFP',
                    value: 'configbfp'
                }]
            }]
        }, {
            type: 1,
            components: [{
                type: 2,
                custom_id: 'status' + message.id,
                style: data?.status ? 3 : 4,
                label: data?.status ? 'Activer' : 'Desactiver',
            }]
        }]
    });

    const collector = msg.createMessageComponentCollector({
        filter: (i) => i.user.id === message.author.id
    })

    collector.on('collect', async(i) => {
        i.deferUpdate();
        if (i.customId ==='showpic' + message.id) {
            if (i.values[0] === 'configpfp') {
                msg.edit({
                    components: [{
                        type: 1,
                        components : [{
                            custom_id: 'pfpc' + message.id,
                            type: 8,
                            label: 'Channel drop pp',
                            value: 'pfp channel'
                        }]
                    }]
                })
            }
            if (i.values[0] === 'configbfp') {
                msg.edit({
                    components: [{
                        type: 1,
                        components : [{
                            custom_id: 'bfpc' + message.id,
                            type: 8,
                            label: 'Channel drop bfp',
                            value: 'bfp channel'
                        }]
                    }]
                })
            }
        }

        if (i.customId === 'status' + message.id) {
            let db = await client.data.get(`showpic_${message.guild.id}`) || { 
                status: false,
                pfp: null,
                bfp: null,
            }
            if(db.hasOwnProperty('status')){
                const currentStatus = db.status;
                const newStatus = !currentStatus;
                db.status = newStatus;
                await client.data.set(`showpic_${message.guild.id}`, db)
                const status = db?.status === true ? "Le status a été activé avec succès" : "Le status a été désactivé avec succès";

                const reply = await message.reply({ content: status, ephemeral: true });
                setTimeout(async () => {
                    await reply.delete();
                }, 2000);

                msg.edit({
                    content: null,
                    embeds: [{
                        title: message.guild.name + " " + "ShowPic",
                        footer:  {text: client.config.footer.text},
                        timestamp: new Date().toISOString(),
                        fields: [{
                            name: 'Statut',
                            value: db.status? '✅ Activer' : '❌ Désactiver',
                            inline: true
                        }, {
                            name: 'PFP',
                            value: `${message.guild.channels.cache.get(db?.pfp) ? message.guild.channels.cache.get(db?.pfp) : 'Non Configurer'}`,
                            inline: true
                        }, {
                            name: 'BFP',
                            value: `${message.guild.channels.cache.get(db?.bfp) ? message.guild.channels.cache.get(db?.bfp) : 'Non Configurer'}`,
                            inline: true
                        }]
                    }],components: [{
                        type: 1,
                        components: [{
                            type: 3,
                            custom_id: 'showpic' + message.id,
                            placeholder: 'Choisis une option',
                            options: [{
                                label: 'Salon PFP',
                                value: 'configpfp'
                            }, {
                                label: 'Salon BFP',
                                value: 'configbfp'
                            }]
                        }]
                    }, {
                        type: 1,
                        components: [{
                            type: 2,
                            custom_id: 'status' + message.id,
                            style: db?.status ? 3 : 4,
                            label: db?.status ? 'Activer' : 'Desactiver',
                        }]
                    }]
                });
            }
        }
    })
    client.on('interactionCreate', async(i) => {
        if (i.customId === 'pfpc' + message.id) {
            let db = await client.data.get(`showpic_${message.guild.id}`) || { 
                status: false,
                pfp: null,
                bfp: null,
            }
            db.pfp = i.values[0];
            await client.data.set(`showpic_${message.guild.id}`, db)
            msg.edit({
                content: null,
                embeds: [{
                    title: message.guild.name + " " + "ShowPic",
                    footer:  {text: client.config.footer.text},
                    timestamp: new Date().toISOString(),
                    fields: [{
                        name: 'Statut',
                        value: db.status? '✅ Activer' : '❌ Désactiver',
                        inline: true
                    }, {
                        name: 'PFP',
                        value: `${message.guild.channels.cache.get(db?.pfp) ? message.guild.channels.cache.get(db?.pfp) : 'Non Configurer'}`,
                        inline: true
                    }, {
                        name: 'BFP',
                        value: `${message.guild.channels.cache.get(db?.bfp) ? message.guild.channels.cache.get(db?.bfp) : 'Non Configurer'}`,
                        inline: true
                    }]
                }],components: [{
                    type: 1,
                    components: [{
                        type: 3,
                        custom_id: 'showpic' + message.id,
                        placeholder: 'Choisis une option',
                        options: [{
                            label: 'Salon PFP',
                            value: 'configpfp'
                        }, {
                            label: 'Salon BFP',
                            value: 'configbfp'
                        }]
                    }]
                }, {
                    type: 1,
                    components: [{
                        type: 2,
                        custom_id: 'status' + message.id,
                        style: db?.status ? 3 : 4,
                        label: db?.status ? 'Activer' : 'Desactiver',
                    }]
                }]
            });
        }
        if (i.customId === 'bfpc' + message.id) {
            let db = await client.data.get(`showpic_${message.guild.id}`) || { 
                status: false,
                pfp: null,
                bfp: null,
            }
            db.bfp = i.values[0];
            await client.data.set(`showpic_${message.guild.id}`, db)
            msg.edit({
                content: null,
                embeds: [{
                    title: message.guild.name + " " + "ShowPic",
                    footer:  {text: client.config.footer.text},
                    timestamp: new Date().toISOString(),
                    fields: [{
                        name: 'Statut',
                        value: db.status? '✅ Activer' : '❌ Désactiver',
                        inline: true
                    }, {
                        name: 'PFP',
                        value: `${message.guild.channels.cache.get(db?.pfp) ? message.guild.channels.cache.get(db?.pfp) : 'Non Configurer'}`,
                        inline: true
                    }, {
                        name: 'BFP',
                        value: `${message.guild.channels.cache.get(db?.bfp) ? message.guild.channels.cache.get(db?.bfp) : 'Non Configurer'}`,
                        inline: true
                    }]
                }],components: [{
                    type: 1,
                    components: [{
                        type: 3,
                        custom_id: 'showpic' + message.id,
                        placeholder: 'Choisis une option',
                        options: [{
                            label: 'Salon PFP',
                            value: 'configpfp'
                        }, {
                            label: 'Salon BFP',
                            value: 'configbfp'
                        }]
                    }]
                }, {
                    type: 1,
                    components: [{
                        type: 2,
                        custom_id: 'status' + message.id,
                        style: db?.status ? 3 : 4,
                        label: db?.status ? 'Activer' : 'Desactiver',
                    }]
                }]
            });
        }
    })
}