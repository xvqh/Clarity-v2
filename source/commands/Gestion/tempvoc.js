const Discord = require('discord.js')
module.exports = {
    name: 'tempvoc',
    category: 'Gestion',
    run: async(client, message, args) => {
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

async function update(client, msg, message) {
    const db = client.data2.get(`tempvocsettings_${message.guild.id}`) || {
        status: false,
        category: null,
        channel: null,
    }

    msg.edit({
        content:null,
        embeds: [{
            color: parseInt(client.color.replace("#", ""), 16),
            title: "Configuration du TempVoc",
            fields: [
                {
                    name: "Status",
                    value: `\`\`\`${db?.status === true ? "✅ Activer" : "❌ Désactiver"}\`\`\``,
                    inline: true
                }, {
                    name: "Catégorie",
                    value: `\`\`\`${message.guild.channels.cache.get(db?.category) ? message.guild.channels.cache.get(db?.category).name : 'Non configuré'}\`\`\``,
                    inline: true
                }, {
                    name: "Salon",
                    value: `\`\`\`${message.guild.channels.cache.get(db?.channel) ? message.guild.channels.cache.get(db?.channel).name : 'Non configuré'}\`\`\``,
                    inline: true
                }
            ],
            footer: client.config.footer
        }],
        components: [{
            type: 1,
            components: [{
                type: 3,
                custom_id: "tempvocconf" + message.id,
                options: [{
                    label: "Status",
                    value: "status"
                },{
                    label: "Catégorie",
                    value: "category"
                }, {
                    label: "Salon",
                    value: "channel"
                }]
            }]
        }]
    })
    let collector = msg.createMessageComponentCollector({
        filter: (i) => i.user.id === message.author.id,
        time: 60000 * 10 * 3
    })
    collector.on("collect", async (i) => {
        if (i.customId === "tempvocconf" + message.id) {
            if(i.values[0] === 'status') {
                let missingOptions = [];
                    if(!db.category) {
                        missingOptions.push('Catégorie')
                    }
                    if(!db.channel) {
                        missingOptions.push('Salon')
                    }
                if(missingOptions.length > 0) {
                    i.update({
                        embeds: [{
                            color: parseInt(client.color.replace("#", ""), 16),
                            title: "Configuration du TempVoc",
                            description: `Veuillez renseigner les options suivantes : ${missingOptions.join(', ')}`,
                            footer: client.config.footer
                        }]
                    })
                }
                else {
                    if (db.hasOwnProperty('status')) {
                        const currentStatus = db.status;
                        const newStatus = !currentStatus;
                        db.status = newStatus;
                        client.data2.set(`tempvocsettings_${message.guild.id}`, db)
                        i.update({
                            content:null,
                            embeds: [{
                                color: parseInt(client.color.replace("#", ""), 16),
                                title: "Configuration du TempVoc",
                                fields: [
                                    {
                                        name: "Status",
                                        value: `\`\`\`${db?.status === true ? "✅ Activer" : "❌ Désactiver"}\`\`\``,
                                        inline: true
                                    }, {
                                        name: "Catégorie",
                                        value: `\`\`\`${message.guild.channels.cache.get(db?.category) ? message.guild.channels.cache.get(db?.category).name : 'Non configuré'}\`\`\``,
                                        inline: true
                                    }, {
                                        name: "Salon",
                                        value: `\`\`\`${message.guild.channels.cache.get(db?.channel) ? message.guild.channels.cache.get(db?.channel).name : 'Non configuré'}\`\`\``,
                                        inline: true
                                    }
                                ],
                                footer: client.config.footer
                            }],
                            components: [{
                                type: 1,
                                components: [{
                                    type: 3,
                                    custom_id: "tempvocconf" + message.id,
                                    options: [{
                                        label: "Status",
                                        value: "status"
                                    },{
                                        label: "Catégorie",
                                        value: "category"
                                    }, {
                                        label: "Salon",
                                        value: "channel"
                                    }]
                                }]
                            }]
                        })
                    }
                }
            }
            if(i.values[0] === 'category') {
                const selectcat = new Discord.ActionRowBuilder().addComponents(
                new Discord.ChannelSelectMenuBuilder()
                    .setCustomId("tempvocconf2" + message.id)
                    .setMinValues(1)
                    .setMaxValues(1)
                    .setPlaceholder("Selectionne une categorie")
                    .setChannelTypes([Discord.ChannelType.GuildCategory])
                )
                // edit the msg with a channel select but filter all channel to get category only

                i.update({
                    embeds: [{
                        color: parseInt(client.color.replace("#", ""), 16),
                        title: "Configuration du TempVoc",
                        description: "Veuillez selectionner une catégorie",
                        footer: client.config.footer
                    }],
                    components: [selectcat]
                })
            }
            if(i.values[0] === 'channel') {
                const selectchan = new Discord.ActionRowBuilder().addComponents(
                new Discord.ChannelSelectMenuBuilder()
                    .setCustomId("tempvocconf3" + message.id)
                    .setMinValues(1)
                    .setMaxValues(1)
                    .setPlaceholder("Selectionne un salon")
                    .setChannelTypes([Discord.ChannelType.GuildVoice])
                )
                // edit the msg with a channel select but filter all channel to get category only
                i.update({
                    embeds: [{
                        color: parseInt(client.color.replace("#", ""), 16),
                        title: "Configuration du TempVoc",
                        description: "Veuillez selectionner un salon",
                        footer: client.config.footer
                    }],
                    components: [selectchan]
                })
            }
        }
    })
    collector.on("end", () => {
        msg.edit({
            content: null,
            embeds: [{
                color: parseInt(client.color.replace("#", ""), 16),
                title: "Configuration du TempVoc",
                description: "Fin de la configuration (Depassement du temps limite)",
                footer: client.config.footer
            }]
        })
    })

    client.on('interactionCreate', async(i) => {
        const db = client.data2.get(`tempvocsettings_${message.guild.id}`) || {
            status: false,
            category: null,
            channel: null
        }
        if (message.author.id === i.user.id) {
        if(i.customId === "tempvocconf2" + message.id) {
            if (db.hasOwnProperty('category')) {
                const channel = i.values[0]
                db.category = channel
                client.data2.set(`tempvocsettings_${message.guild.id}`, db)
                i.update({
                    content:null,
        embeds: [{
            color: parseInt(client.color.replace("#", ""), 16),
            title: "Configuration du TempVoc",
            fields: [
                {
                    name: "Status",
                    value: `\`\`\`${db?.status === true ? "✅ Activer" : "❌ Désactiver"}\`\`\``,
                    inline: true
                }, {
                    name: "Catégorie",
                    value: `\`\`\`${message.guild.channels.cache.get(db?.category) ? message.guild.channels.cache.get(db?.category).name : 'Non configuré'}\`\`\``,
                    inline: true
                }, {
                    name: "Salon",
                    value: `\`\`\`${message.guild.channels.cache.get(db?.channel) ? message.guild.channels.cache.get(db?.channel).name : 'Non configuré'}\`\`\``,
                    inline: true
                }
            ],
            footer: client.config.footer
        }],
        components: [{
            type: 1,
            components: [{
                type: 3,
                custom_id: "tempvocconf" + message.id,
                options: [{
                    label: "Status",
                    value: "status"
                },{
                    label: "Catégorie",
                    value: "category"
                }, {
                    label: "Salon",
                    value: "channel"
                }]
            }]
        }]
                })
            } else {
                client.data2.set(`tempvocsettings_${message.guild.id}`, db)
            }
        }
        if(i.customId === "tempvocconf3" + message.id) {
            if (db.hasOwnProperty('channel')) {
                const channel = i.values[0]
                db.channel = channel
                client.data2.set(`tempvocsettings_${message.guild.id}`, db)
                i.update({
                    content:null,
        embeds: [{
            color: parseInt(client.color.replace("#", ""), 16),
            title: "Configuration du TempVoc",
            fields: [
                {
                    name: "Status",
                    value: `\`\`\`${db?.status === true ? "✅ Activer" : "❌ Désactiver"}\`\`\``,
                    inline: true
                }, {
                    name: "Catégorie",
                    value: `\`\`\`${message.guild.channels.cache.get(db?.category) ? message.guild.channels.cache.get(db?.category).name : 'Non configuré'}\`\`\``,
                    inline: true
                }, {
                    name: "Salon",
                    value: `\`\`\`${message.guild.channels.cache.get(db?.channel) ? message.guild.channels.cache.get(db?.channel).name : 'Non configuré'}\`\`\``,
                    inline: true
                }
            ],
            footer: client.config.footer
        }],
        components: [{
            type: 1,
            components: [{
                type: 3,
                custom_id: "tempvocconf" + message.id,
                options: [{
                    label: "Status",
                    value: "status"
                },{
                    label: "Catégorie",
                    value: "category"
                }, {
                    label: "Salon",
                    value: "channel"
                }]
            }]
        }]
                })
        } else {
            client.data2.set(`tempvocsettings_${message.guild.id}`, db)
        }
    }
    }
})
}