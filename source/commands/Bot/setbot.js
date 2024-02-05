import { EmbedBuilder } from "discord.js";

export default {
    name: "setbot",
    aliases: ["setprofil"],
    description: "Permet de modifier le profil du bot",
    category: "🛠️〢Buyer",
    /**
     * @param {Clarity} client
     */
    run: async (client, message, args) => {
        const isOwn = await client.db.oneOrNone(
            `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
            [message.author.id]
        );
        if (!isOwn) {
            return message.reply({
                content: " vous n'avez pas la permission d'utiliser cette commande",
            });
        }
      
       let msg = await message.channel.send({content: "Chargement du module . . ."})
       await update(client, message, msg)
        }
        }

        async function update(client, message, msg) {
            await client.db.none(`
            CREATE TABLE IF NOT EXISTS clarity_${client.user.id}_bot_status (
                type TEXT,
                status TEXT,
                presence TEXT
            )
        `);
            let color = parseInt(client.color.replace('#', ''), 16);
            msg.edit({
                content: null,
                embeds: [new EmbedBuilder({
                    title: client.user.username + " " + "Custom Panel",
                    image: {url: ""},
                    color: color,
                    footer: client.config.footer,
                    timestamp: new Date(),
                    fields: [
                        {name: "Nom du bot", value: client.user.username},
                        {name: "Status du bot", value: `${client.presence.status}`},
                        {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                    ],
                    image: {
                        url: client.user.avatarURL({dynamic: true})
                    }
                })
            ],
            components: [{
                type: 1,
                components: [{
                    type: 3,
                    custom_id: "botm" + msg.id,
                    options: [{
                        label: "Modifier le nom du bot",
                        value: "cname",
                        emoji: "1️⃣"
                    }, {
                        label: "Modifier le status du bot",
                        value: "cstatus",
                        emoji: "2️⃣"
                    }, {
                        label: "Modifier l'activité du bot",
                        value: "cactivity",
                        emoji: "3️⃣"
                    },{
                        label: "Modifier l'avatar du bot",
                        value: "cavatar",
                        emoji: "4️⃣"
                    }, {
                        label: "Annuler",
                        value: "cancel",
                        emoji: "❌"
                    }]
                }]
            }]
            })
            let collector = msg.createMessageComponentCollector({ time: 1000 * 60 });
            collector.on("collect", async i => {
                if (i.user.id !== message.author.id) return i.reply({ content: "Vous ne pouvez pas utiliser un menu qui n'est pas le vôtre", ephemeral: true });
                i.deferUpdate()
                if (i.customId === "botm" + msg.id) {
                    if (i.values[0] === "cname") {
                        let quest = await i.channel.send({content: "Quel est le nouveau nom du bot?"})
                        let rep = await i.channel.awaitMessages({filter: m => m.author.id == i.user.id, max: 1, time: 30_000})
                        if (rep.first()) {
                            quest.delete()
                            client.user.username = rep.first.content
                            client.user.setUsername(rep.first().content)
                            rep.first().delete()
                            msg.edit({
                                content: null,
                                embeds: [new EmbedBuilder({
                                    title: client.user.username + " " + "Custom Panel",
                                    image: {url: ""},
                                    color: color,
                                    footer: client.config.footer,
                                    timestamp: new Date(),
                                    fields: [
                                        {name: "Nom du bot", value: client.user.username},
                                        {name: "Status du bot", value: `${client.presence.status}`},
                                        {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                    ],
                                    image: {
                                        url: client.user.avatarURL({dynamic: true})
                                    }
                                })],
                            })
                        }
                    }
                    else if (i.values[0] === "cstatus") {
                        msg.edit({
                            content: null,
                            embeds: [new EmbedBuilder({
                                title: client.user.username + " " + "Custom Panel",
                                image: {url: ""},
                                color: color,
                                footer: client.config.footer,
                                timestamp: new Date(),
                                fields: [
                                    {name: "Nom du bot", value: client.user.username},
                                    {name: "Status du bot", value: `${client.presence.status}`},
                                    {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                ],
                                image: {
                                    url: client.user.avatarURL({dynamic: true})
                                }
                            })],
                            components: [{
                                type: 1,
                                components: [{
                                    type: 3,
                                    custom_id: "botcs" + msg.id,
                                    options: [{
                                        label: "Online",
                                        value: "online",
                                        emoji: "🟢"
                                    }, {
                                        label: "Idle",
                                        value: "idle",
                                        emoji: "🟡"
                                    }, {
                                        label: "Dnd",
                                        value: "dnd",
                                        emoji: "🔴"
                                    }, {
                                        label: "Invisible",
                                        value: "invisible",
                                        emoji: "⚫"
                                    },{
                                        label: "Annuler",
                                        value: "cancel",
                                        emoji: "❌"
                                    }]
                                }]
                            }]
                        })
                    }
                    else if (i.values[0] === "cactivity") {
                        msg.edit({
                            content: null,
                            embeds: [new EmbedBuilder({
                                title: client.user.username + " " + "Custom Panel",
                                image: {url: ""},
                                color: color,
                                footer: client.config.footer,
                                timestamp: new Date(),
                                fields: [
                                    {name: "Nom du bot", value: client.user.username},
                                    {name: "Status du bot", value: `${client.presence.status}`},
                                    {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                ],
                                image: {
                                    url: client.user.avatarURL({dynamic: true})
                                }
                            })],
                            components: [{
                                type: 1,
                                components: [{
                                    type: 3,
                                    custom_id: "botms" + msg.id,
                                    options: [{
                                        label: "Joue à",
                                        value: "playing",
                                        emoji: "1️⃣"
                                    }, {
                                        label: "Regarde",
                                        value: "watching",
                                        emoji: "2️⃣"
                                    }, {
                                        label: "Ecoute",
                                        value: "listen",
                                        emoji: "3️⃣"
                                    }, {
                                        label: "Stream",
                                        value: "stream",
                                        emoji: "4️⃣"
                                    }, {
                                        label: "Participe",
                                        value: "compet",
                                        emoji: "5️⃣"
                                    },{
                                        label: 'Custom',
                                        value: 'custom',
                                        emoji: '6️⃣'
                                    },{
                                        label: "Annuler",
                                        value: "cancel",
                                        emoji: "❌"
                                    }]
                                }]
                            }]
                        })
                    }  
                    else if (i.values[0] === "cavatar") {
                        let quest = await i.channel.send({content: "Quel est le nouvel avatar du bot?"})
                        let rep = await i.channel.awaitMessages({filter: m => m.author.id == i.user.id, max: 1, time: 30_000})
                        if (rep.first()) {
                            // check si l avatar provient d un lien discord ou d un fichier 
                            if (rep.first().content.startsWith("https://")) {
                                quest.delete()
                                client.user.avatar = rep.first().content
                                client.user.setAvatar(rep.first().content)
                                rep.first().delete()
                                msg.edit({
                                    content: null,
                                    embeds: [new EmbedBuilder({
                                        title: client.user.username + " " + "Custom Panel",
                                        image: {url: ""},
                                        color: color,
                                        footer: client.config.footer,
                                        timestamp: new Date(),
                                        fields: [
                                            {name: "Nom du bot", value: client.user.username},
                                            {name: "Status du bot", value: `${client.presence.status}`},
                                            {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                        ],
                                        image: {
                                            url: client.user.avatar
                                        }
                                    })],
                                })
                            }
                            else {
                                quest.delete()
                                client.user.avatar = rep.first().attachments.first().url
                                client.user.setAvatar(rep.first().attachments.first().url)
                                rep.first().delete()
                                msg.edit({
                                    content: null,
                                    embeds: [new EmbedBuilder({
                                        title: client.user.username + " " + "Custom Panel",
                                        image: {url: ""},
                                        color: color,
                                        footer: client.config.footer,
                                        timestamp: new Date(),
                                        fields: [
                                            {name: "Nom du bot", value: client.user.username},
                                            {name: "Status du bot", value: `${client.presence.status}`},
                                            {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                        ],
                                        image: {
                                            url: client.user.avatar
                                        }
                                    })],
                                })
                            }
                        }
                    }
                }
                if (i.customId === "botms" + msg.id) {
                    if (i.values[0] === "cancel") {
                       msg.edit({
                           content: null,
                           embeds: [new EmbedBuilder({
                               title: client.user.username + " " + "Custom Panel",
                               image: {url: ""},
                               color: color,
                               footer: client.config.footer,
                               timestamp: new Date(),
                               fields: [
                                   {name: "Nom du bot", value: client.user.username},
                                   {name: "Status du bot", value: `${client.presence.status}`},
                                   {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                               ],
                               image: {
                                   url: client.user.avatarURL({dynamic: true})
                               }
                           })
                       ],
                       components: [{
                           type: 1,
                           components: [{
                               type: 3,
                               custom_id: "botm" + msg.id,
                               options: [{
                                   label: "Modifier le nom du bot",
                                   value: "cname",
                                   emoji: "1️⃣"
                               }, {
                                   label: "Modifier le status du bot",
                                   value: "cstatus",
                                   emoji: "2️⃣"
                               }, {
                                   label: "Modifier l'activité du bot",
                                   value: "cactivity",
                                   emoji: "3️⃣"
                               },{
                                   label: "Modifier l'avatar du bot",
                                   value: "cavatar",
                                   emoji: "4️⃣"
                               }, {
                                   label: "Annuler",
                                   value: "cancel",
                                   emoji: "❌"
                               }]
                           }]
                       }]
                       })
                    }
                    if (i.values[0] === "playing") {
                       let quest = await i.channel.send({content: "Quel est la nouvelle activité du bot?"})
                       let rep = await i.channel.awaitMessages({filter: m => m.author.id == i.user.id, max: 1, time: 30_000})
                       if (rep.first()) {
                           quest.delete()
                           client.user.setPresence({activities: [{name: rep.first().content, type: 0}]});
                           rep.first().delete()
                           msg.edit({
                               content: null,
                               embeds: [new EmbedBuilder({
                                   title: client.user.username + " " + "Custom Panel",
                                   image: {url: ""},
                                   color: color,
                                   footer: client.config.footer,
                                   timestamp: new Date(),
                                   fields: [
                                       {name: "Nom du bot", value: client.user.username},
                                       {name: "Status du bot", value: `${client.presence.status}`},
                                       {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                   ],
                                   image: {
                                       url: client.user.avatarURL({dynamic: true})
                                   }
                               })],
                           })
                           await client.db.none(`UPDATE clarity_${client.user.id}_bot_status SET type = \$1, status = \$2`, ['play', rep.first().content]);
                       }
                    }
                    if (i.values[0] === "watching") {
                       let quest = await i.channel.send({content: "Quel est la nouvelle activité du bot?"})
                       let rep = await i.channel.awaitMessages({filter: m => m.author.id == i.user.id, max: 1, time: 30_000})
                       if (rep.first()) {
                           quest.delete()
                           client.user.setPresence({activities: [{name: rep.first().content, type: 3}]});
                           rep.first().delete()
                           msg.edit({
                               content: null,
                               embeds: [new EmbedBuilder({
                                   title: client.user.username + " " + "Custom Panel",
                                   image: {url: ""},
                                   color: color,
                                   footer: client.config.footer,
                                   timestamp: new Date(),
                                   fields: [
                                       {name: "Nom du bot", value: client.user.username},
                                       {name: "Status du bot", value: `${client.presence.status}`},
                                       {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                   ],
                                   image: {
                                       url: client.user.avatarURL({dynamic: true})
                                   }
                               })],
                           })
                           await client.db.none(`UPDATE clarity_${client.user.id}_bot_status SET type = \$1, status = \$2`, ['watch', rep.first().content]);
                       }
                    }
                    if (i.values[0] === "listen") {
                       let quest = await i.channel.send({content: "Quel est la nouvelle activité du bot?"})
                       let rep = await i.channel.awaitMessages({filter: m => m.author.id == i.user.id, max: 1, time: 30_000})
                       if (rep.first()) {
                           quest.delete()
                           client.user.setPresence({activities: [{name: rep.first().content, type: 2}]});
                           rep.first().delete()
                           msg.edit({
                               content: null,
                               embeds: [new EmbedBuilder({
                                   title: client.user.username + " " + "Custom Panel",
                                   image: {url: ""},
                                   color: color,
                                   footer: client.config.footer,
                                   timestamp: new Date(),
                                   fields: [
                                       {name: "Nom du bot", value: client.user.username},
                                       {name: "Status du bot", value: `${client.presence.status}`},
                                       {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                   ],
                                   image: {
                                       url: client.user.avatarURL({dynamic: true})
                                   }
                               })],
                           })
                           await client.db.none(`UPDATE clarity_${client.user.id}_bot_status SET type = \$1, status = \$2`, ['listen', rep.first().content]);
                       }
                    }
                    if(i.values[0] === 'custom') {
                        let quest = await i.channel.send({content: "Quel est la nouvelle activité du bot?"})
                        let rep = await i.channel.awaitMessages({filter: m => m.author.id == i.user.id, max: 1, time: 30_000})
                        if (rep.first()) {
                            quest.delete()
                            client.user.setPresence({activities: [{name: rep.first().content, type: 4}]});
                            rep.first().delete()
                            msg.edit({
                                content: null,
                                embeds: [new EmbedBuilder({
                                    title: client.user.username + " " + "Custom Panel",
                                    image: {url: ""},
                                    color: color,
                                    footer: client.config.footer,
                                    timestamp: new Date(),
                                    fields: [
                                        {name: "Nom du bot", value: client.user.username},
                                        {name: "Status du bot", value: `${client.presence.status}`},
                                        {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                    ],
                                    image: {
                                        url: client.user.avatarURL({dynamic: true})
                                    }
                                })],
                            })
                            await client.db.none(`UPDATE clarity_${client.user.id}_bot_status SET type = \$1, status = \$2`, ['custom', rep.first().content]);
                        }
                    }
                    if (i.values[0] === "stream") {
                       let quest = await i.channel.send({content: "Quel est la nouvelle activité du bot?"})
                       let rep = await i.channel.awaitMessages({filter: m => m.author.id == i.user.id, max: 1, time: 30_000})
                       if (rep.first()) {
                           quest.delete()
                           client.user.setPresence({activities: [{name: rep.first().content, type: 1}]});
                           rep.first().delete()
                           msg.edit({
                               content: null,
                               embeds: [new EmbedBuilder({
                                   title: client.user.username + " " + "Custom Panel",
                                   image: {url: ""},
                                   color: color,
                                   footer: client.config.footer,
                                   timestamp: new Date(),
                                   fields: [
                                       {name: "Nom du bot", value: client.user.username},
                                       {name: "Status du bot", value: `${client.presence.status}`},
                                       {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                   ],
                                   image: {
                                       url: client.user.avatarURL({dynamic: true})
                                   }
                               })],
                           })
                           await client.db.none(`UPDATE clarity_${client.user.id}_bot_status SET type = \$1, status = \$2`, ['stream', rep.first().content]);
                       }
                    }
                    if (i.values[0] === "compet") {
                       let quest = await i.channel.send({content: "Quel est la nouvelle activité du bot?"})
                       let rep = await i.channel.awaitMessages({filter: m => m.author.id == i.user.id, max: 1, time: 30_000})
                       if (rep.first()) {
                           quest.delete()
                           client.user.setPresence({activities: [{name: rep.first().content, type: 5}]});
                           rep.first().delete()
                           msg.edit({
                               content: null,
                               embeds: [new EmbedBuilder({
                                   title: client.user.username + " " + "Custom Panel",
                                   image: {url: ""},
                                   color: color,
                                   footer: client.config.footer,
                                   timestamp: new Date(),
                                   fields: [
                                       {name: "Nom du bot", value: client.user.username},
                                       {name: "Status du bot", value: `${client.presence.status}`},
                                       {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                   ],
                                   image: {
                                       url: client.user.avatarURL({dynamic: true})
                                   }
                               })],
                           })
                           await client.db.none(`UPDATE clarity_${client.user.id}_bot_status SET type = \$1, status = \$2`, ['compet', rep.first().content]);
                       }
                    }
                }
                if (i.customId === "botcs" + msg.id) {
                    if (i.values[0] === "cancel") {
                        msg.edit({
                            content: null,
                            embeds: [new EmbedBuilder({
                                title: client.user.username + " " + "Custom Panel",
                                image: {url: ""},
                                color: color,
                                footer: client.config.footer,
                                timestamp: new Date(),
                                fields: [
                                    {name: "Nom du bot", value: client.user.username},
                                    {name: "Status du bot", value: `${client.presence.status}`},
                                    {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                ],
                                image: {
                                    url: client.user.avatarURL({dynamic: true})
                                }
                            })
                        ],
                        components: [{
                            type: 1,
                            components: [{
                                type: 3,
                                custom_id: "botm" + msg.id,
                                options: [{
                                    label: "Modifier le nom du bot",
                                    value: "cname",
                                    emoji: "1️⃣"
                                }, {
                                    label: "Modifier le status du bot",
                                    value: "cstatus",
                                    emoji: "2️⃣"
                                }, {
                                    label: "Modifier l'activité du bot",
                                    value: "cactivity",
                                    emoji: "3️⃣"
                                },{
                                    label: "Modifier l'avatar du bot",
                                    value: "cavatar",
                                    emoji: "4️⃣"
                                }, {
                                    label: "Annuler",
                                    value: "cancel",
                                    emoji: "❌"
                                }]
                            }]
                        }]
                        })
                     }
                     else if (i.values[0] === "online") {
                        client.user.setPresence({status: "online"});
                        msg.edit({
                            content: null,
                            embeds: [new EmbedBuilder({
                                title: client.user.username + " " + "Custom Panel",
                                image: {url: ""},
                                color: color,
                                footer: client.config.footer,
                                timestamp: new Date(),
                                fields: [
                                    {name: "Nom du bot", value: client.user.username},
                                    {name: "Status du bot", value: `${client.presence.status}`},
                                    {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                ],
                                image: {
                                    url: client.user.avatarURL({dynamic: true})
                                }
                            })
                        ]})
                        await client.db.none(`UPDATE clarity_${client.user.id}_bot_status SET presence`, ['online']);
                     }
                     else if (i.values[0] === "dnd") {
                        client.user.setPresence({status: "dnd"});
                        msg.edit({
                            content: null,
                            embeds: [new EmbedBuilder({
                                title: client.user.username + " " + "Custom Panel",
                                image: {url: ""},
                                color: color,
                                footer: client.config.footer,
                                timestamp: new Date(),
                                fields: [
                                    {name: "Nom du bot", value: client.user.username},
                                    {name: "Status du bot", value: `${client.presence.status}`},
                                    {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                ],
                                image: {
                                    url: client.user.avatarURL({dynamic: true})
                                }
                            })
                        ]})
                        await client.db.none(`UPDATE clarity_${client.user.id}_bot_status SET presence`, ['dnd']);
                     }
                     else if (i.values[0] === "idle") {
                        client.user.setPresence({status: "idle"});
                        msg.edit({
                            content: null,
                            embeds: [new EmbedBuilder({
                                title: client.user.username + " " + "Custom Panel",
                                image: {url: ""},
                                color: color,
                                footer: client.config.footer,
                                timestamp: new Date(),
                                fields: [
                                    {name: "Nom du bot", value: client.user.username},
                                    {name: "Status du bot", value: `${client.presence.status}`},
                                    {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                ],
                                image: {
                                    url: client.user.avatarURL({dynamic: true})
                                }
                            })
                        ]})
                        await client.db.none(`UPDATE clarity_${client.user.id}_bot_status SET presence`, ['idlle']);
                     }
                     else if (i.values[0] === "invisible") {
                        client.user.setPresence({status: "invisible"});
                        msg.edit({
                            content: null,
                            embeds: [new EmbedBuilder({
                                title: client.user.username + " " + "Custom Panel",
                                image: {url: ""},
                                color: color,
                                footer: client.config.footer,
                                timestamp: new Date(),
                                fields: [
                                    {name: "Nom du bot", value: client.user.username},
                                    {name: "Status du bot", value: `${client.presence.status}`},
                                    {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                ],
                                image: {
                                    url: client.user.avatarURL({dynamic: true})
                                }
                            })
                        ]})
                        await client.db.none(`UPDATE clarity_${client.user.id}_bot_status SET presence`, ['invisible']);
                     }
                }
            })
        }