module.exports = {
    name: "sethelp",
    category: "Gestion",
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
    let color = parseInt(client.color.replace('#', ''), 16);
    let data = await client.data.get(`settings_${client.user.id}`) || {
        style: null,
        image: null
    }

await msg.edit({
    content: null,
    embeds: [{
        title: client.user.username + " " + "Help Configuration Panel",
        color: color,
        description: `Style Actuel : ${data.style ? data.style : 'onepage'}`,
        footer: client.config.footer,
        timestamp: new Date(),
        fields: [
            {
                name: "OnePage",
                value: "onepage",
                inline: true
            },
            {
                name: "Bouttons",
                value: "buttons",
                inline: true
            }, {
                name: "Menu",
                value: "menu",
                inline: true
            }
            ],
        image: {
            url: data.image ? data.image : client.user.avatarURL({dynamic: true})
        }
    }],
    components: [{
        type: 1,
        components: [{
            type: 3,
            custom_id: "helpconf" + message.id,
            options: [
                {
                    label: "OnePage",
                    value: "onepage"
                },
                {
                    label: "Bouttons",
                    value: "buttons"
                },
                {
                    label: "Menu",
                    value: "menu"
                }, {
                    label: "Modifier l'image",
                    value: "helpimg"
                }
            ]
        }]
    }]
})
    let collector = await msg.createMessageComponentCollector({
        filter: (i) => i.user.id === message.author.id,
        time: 300000*6*10
    })
    collector.on('collect', async (i) => {
        if (i.customId === 'helpconf' + message.id) {
            if (i.values[0] === 'onepage') {
                let data = await client.data.get(`settings_${client.user.id}`) || {
                    style: null,
                    image: null
                }
                data.style = 'onepage';
                    await client.data.set(`settings_${client.user.id}`, data)
                const status = `Le style du help vient de changer en **OnePage**`;

                const reply = await i.reply({ content: status, ephemeral: true });
                setTimeout(async () => {
                    await reply.delete();
                }, 2000);
                await msg.edit({
                    content: null,
                    embeds: [{
                        title: client.user.username + " " + "Help Configuration Panel",
                        color: color,
                        description: `Style Actuel : ${data.style ? data.style : 'onepage'}`,
                        footer: client.config.footer,
                        timestamp: new Date(),
                        fields: [
                            {
                                name: "OnePage",
                                value: "onepage",
                                inline: true
                            },
                            {
                                name: "Bouttons",
                                value: "buttons",
                                inline: true
                            },
                            {
                                name: "Menu",
                                value: "menu",
                                inline: true
                            }
                        ],
                        image: {
                            url: data.image ? data.image : client.user.avatarURL({dynamic: true})
                        }
                    }],
                })
            }
            else if (i.values[0] === 'buttons') {
                let data = await client.data.get(`settings_${client.user.id}`) || {
                    style: null,
                    image: null
                }
                data.style = 'buttons';
                    await client.data.set(`settings_${client.user.id}`, data)
                const status = `Le style du help vient de changer en **Bouttons**`;
                const reply = await i.reply({ content: status, ephemeral: true });
                setTimeout(async () => {
                    await reply.delete();
                }, 2000);
                await msg.edit({
                    content: null,
                    embeds: [{
                        title: client.user.username + " " + "Help Configuration Panel",
                        color: color,
                        description: `Style Actuel : ${data.style ? data.style : 'onepage'}`,
                        footer: client.config.footer,
                        timestamp: new Date(),
                        fields: [
                            {
                                name: "OnePage",
                                value: "onepage",
                                inline: true
                            },
                            {
                                name: "Bouttons",
                                value: "buttons",
                                inline: true
                            },
                            {
                                name: "Menu",
                                value: "menu",
                                inline: true
                            }
                        ],
                        image: {
                            url: data.image ? data.image : client.user.avatarURL({dynamic: true})
                        }
                    }],
                })
            }
            else if (i.values[0] === 'menu') {
                let data = await client.data.get(`settings_${client.user.id}`) || {
                    style: null,
                    image: null
                };
                data.style = 'menu';
                    await client.data.set(`settings_${client.user.id}`, data)
                const status = `Le style du help vient de changer en **Menu**`;
                const reply = await i.reply({ content: status, ephemeral: true });
                setTimeout(async () => {
                    await reply.delete();
                }, 2000);
                await msg.edit({
                    content: null,
                    embeds: [{
                        title: client.user.username + " " + "Help Configuration Panel",
                        color: color,
                        description: `Style Actuel : ${data.style ? data.style : 'onepage'}`,
                        footer: client.config.footer,
                        timestamp: new Date(),
                        fields: [
                            {
                                name: "OnePage",
                                value: "onepage",
                                inline: true
                            },
                            {
                                name: "Bouttons",
                                value: "buttons",
                                inline: true
                            },
                            {
                                name: "Menu",
                                value: "menu",
                                inline: true
                            }
                        ],
                        image: {
                            url: data.image ? data.image : client.user.avatarURL({dynamic: true})
                        }
                    }],
                })
            }
            else if (i.values[0] === "helpimg") {
                let quest = await i.channel.send({content: "Quel est la nouvelle image du help?"})
                let rep = await i.channel.awaitMessages({filter: m => m.author.id == i.user.id, max: 1, time: 30_000})
                if (rep.first()) {
                    if (rep.first().content.startsWith("https://")) {
                        let data = await client.data.get(`settings_${client.user.id}`) || {
                            style: null,
                            image: null
                        }
                        quest.delete()
                        data.image = rep.first().content;
                        rep.first().delete();
                        await client.data.set(`settings_${client.user.id}`, data)
                        await msg.edit({
                            content: null,
                            embeds: [{
                                title: client.user.username + " " + "Help Configuration Panel",
                                color: color,
                                description: `Style Actuel : ${data.style ? data.style : 'onepage'}`,
                                footer: client.config.footer,
                                timestamp: new Date(),
                                fields: [
                                    {
                                        name: "OnePage",
                                        value: "onepage",
                                        inline: true
                                    },
                                    {
                                        name: "Bouttons",
                                        value: "buttons",
                                        inline: true
                                    }, {
                                        name: "Menu",
                                        value: "menu",
                                        inline: true
                                    }
                                ],
                                image: {
                                    url: data.image ? data.image : client.user.avatarURL({dynamic: true})
                                }
                            }],
                        })

                    } else {
                        quest.delete()
                    let data = await client.data.get(`settings_${client.user.id}`) || {
                        style: null,
                        image: null
                    }
                    data.image = rep.first().attachments.first().url
                    await client.data.set(`settings_${client.user.id}`, data)
                    await msg.edit({
                        content: null,
                        embeds: [{
                            title: client.user.username + " " + "Help Configuration Panel",
                            color: color,
                            description: `Style Actuel : ${data.style ? data.style : 'onepage'}`,
                            footer: client.config.footer,
                            timestamp: new Date(),
                            fields: [
                                {
                                    name: "OnePage",
                                    value: "onepage",
                                    inline: true
                                },
                                {
                                    name: "Bouttons",
                                    value: "buttons",
                                    inline: true
                                }, {
                                    name: "Menu",
                                    value: "menu",
                                    inline: true
                                }
                            ],
                            image: {
                                url: data.image ? data.image : client.user.avatarURL({dynamic: true})
                            }
                        }],
                    })
                }
                }

            }

        }
    })
}