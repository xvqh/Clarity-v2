const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: "presetlog",
    category: "📄〢Logs",
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
          // check si la table log existe , si elle existe la cree avec comme info : guildid , msglog(VARCHAR20), voicelog(VARCHAR20), modlog(VARCHAR20), giveawaylog(VARCHAR20), emojilog(VARCHAR20), channellog(VARCHAR20), botlog(VARCHAR20), permlog(VARCHAR20), ticketlog(VARCHAR20), boostlog, (VARCHAR20), joinleavelog(VARCHAR20), veriflog(VARCHAR20), syslog(VARCHAR20), rolelog(VARCHAR20)
          if (args[0] === "all") {
          await client.db.none(`
            CREATE TABLE IF NOT EXISTS clarity_${client.user.id}_${message.guild.id}_logs (
                msgdlog VARCHAR(20),
                msgelog VARCHAR(20),
                msgbdlog VARCHAR(20),
                gmulog VARCHAR(20),
                commandlog VARCHAR(20),
                badwordlog VARCHAR(20),
                floplog VARCHAR(20),
                bumplog VARCHAR(20),
                voicejoinlog VARCHAR(20),
                voiceleavelog VARCHAR(20),
                modlog VARCHAR(20),
                emojiclog VARCHAR(20),
                emojidlog VARCHAR(20),
                emojiulog VARCHAR(20),
                channelclog VARCHAR(20),
                channeldlog VARCHAR(20),
                channelulog VARCHAR(20),
                botlog VARCHAR(20),
                permlog VARCHAR(20),
                ticketlog VARCHAR(20),
                boostlog VARCHAR(20),
                joinleavelog VARCHAR(20),
                veriflog VARCHAR(20),
                syslog VARCHAR(20),
                roleclog VARCHAR(20),
                roledlog VARCHAR(20),
                roleulog VARCHAR(20),
                giveawaylog VARCHAR(20),
                raidlog VARCHAR(20),
                guildlog VARCHAR(20)
            )
        `)
        const color = parseInt(client.color.replace("#", ""), 16);
    let msg = await message.channel.send({ content: `Création de la **catégorie** des logs en cours..` }).then(msge => {
        // cree une catégorie LOGS
        message.guild.channels.create( {
            name: `${message.guild.name}・LOGS`,
          type: 4,
          permissionOverwrites: [
            {
              id: message.guild.id,
              deny: ["ViewChannel"],
              allow: ["SendMessages"]
            },
          ],
        }).then(c => {
            // crée les salons dans cette categorie
            c.setPosition(0)
            c.guild.channels.create({
                name: "📁・logs-messages-del",
                type: 0,
                parent: c.id,
                permissionOverwrites: [
                    {
                        id: message.guild.id,
                        deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                        allow: [PermissionsBitField.Flags.SendMessages]
                    },
                ],
               }).then(mess => {
                // save dans la db l id du channel pour msglog
                client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (msgdlog) VALUES ($1)`, [mess.id])
                c.guild.channels.create({
                    name: "📁・logs-boosts",
                    type: 0,
                    parent: c.id,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                            allow: [PermissionsBitField.Flags.SendMessages]
                        },
                    ],
                }).then(boost => {
                    // save dans la db l id du channel pour boostlog
                    client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (boostlog) VALUES ($1)`, [boost.id])
                    c.guild.channels.create({
                        name: "📁・logs-vocal-join",
                        type: 0,
                        parent: c.id,
                        permissionOverwrites: [
                            {
                                id: message.guild.id,
                                deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                allow: [PermissionsBitField.Flags.SendMessages]
                            },
                        ],
                    }).then(voice => {
                        // save dans la db l id du channel pour voicelog
                        client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (voicejoinlog) VALUES ($1)`, [voice.id])
                        c.guild.channels.create({
                            name: "📁・logs-mods",
                            type: 0,
                            parent: c.id,
                            permissionOverwrites: [
                                {
                                    id: message.guild.id,
                                    deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                    allow: [PermissionsBitField.Flags.SendMessages]
                                },
                            ],
                        }).then(mod => {
                            // save dans la db l id du channel pour modlog
                            client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (modlog) VALUES ($1)`, [mod.id])
                            c.guild.channels.create({
                                name: "📁・logs-emojis-create", 
                                type: 0,
                                parent: c.id,
                                permissionOverwrites: [
                                    {
                                        id: message.guild.id,
                                        deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                        allow: [PermissionsBitField.Flags.SendMessages]
                                    },
                                ],
                            }).then(emoji => {
                                // save dans la db l id du channel pour emojilog
                                client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (emojiclog) VALUES ($1)`, [emoji.id])
                                c.guild.channels.create({
                                    name: "📁・logs-roles-create", 
                                    type: 0,
                                    parent: c.id,
                                    permissionOverwrites: [
                                        {
                                            id: message.guild.id,
                                            deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                            allow: [PermissionsBitField.Flags.SendMessages]
                                        }
                                    ]
                        }).then(role => {
                            // save dans la db l id du channel pour rolelog
                            client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (roleclog) VALUES ($1)`, [role.id])
                            c.guild.channels.create({
                                name: "📁・logs-tickets", 
                                type: 0,
                                parent: c.id,
                                permissionOverwrites: [
                                    {
                                        id: message.guild.id,
                                        deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                        allow: [PermissionsBitField.Flags.SendMessages]
                                    },
                                ],
                            }).then(ticket => {
                                // save dans la db l id du channel pour ticketlog
                                client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (ticketlog) VALUES ($1)`, [ticket.id])
                                c.guild.channels.create({
                                    name: "📁・logs-verification", 
                                    type: 0,
                                    parent: c.id,
                                    permissionOverwrites: [
                                        {
                                            id: message.guild.id,
                                            deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                            allow: [PermissionsBitField.Flags.SendMessages]
                                        }]
                        }).then(verif => {
                            // save dans la db l id du channel pour veriflog
                            client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (veriflog) VALUES ($1)`, [verif.id])
                            c.guild.channels.create({
                                name: "📁・logs-sys", 
                                type: 0,
                                parent: c.id,
                                permissionOverwrites: [
                                    {
                                        id: message.guild.id,
                                        deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                        allow: [PermissionsBitField.Flags.SendMessages]
                                    }]
                        }).then(sys => {
                            // save dans la db l id du channel pour syslog
                            client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (syslog) VALUES ($1)`, [sys.id])
                            c.guild.channels.create({
                                name: "📁・logs-perms", 
                                type: 0,
                                parent: c.id,
                                permissionOverwrites: [
                                    {
                                        id: message.guild.id,
                                        deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                        allow: [PermissionsBitField.Flags.SendMessages]
                                    }]
                        }).then(perm => {
                            // save dans la db l id du channel pour permlog
                            client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (permlog) VALUES ($1)`, [perm.id])
                            c.guild.channels.create({
                                name: "📁・logs-giveaway", 
                                type: 0,
                                parent: c.id,
                                permissionOverwrites: [
                                    {
                                        id: message.guild.id,
                                        deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                        allow: [PermissionsBitField.Flags.SendMessages]
                                    }]
                            }).then(gw => {
                            // save dans la db l id du channel pour giveawaylog
                            client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (giveawaylog) VALUES ($1)`, [gw.id])
                            c.guild.channels.create({
                                name: "📁・logs-joins-leave", 
                                type: 0,
                                parent: c.id,
                                permissionOverwrites: [
                                    {
                                        id: message.guild.id,
                                        deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                        allow: [PermissionsBitField.Flags.SendMessages]
                                    }]
                            }).then(joinleave => {
                            // save dans la db l id du channel pour joinlog
                            client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (joinleavelog) VALUES ($1)`, [joinleave.id])
                            c.guild.channels.create({
                                name: "📁・logs-bot", 
                                type: 0,
                                parent: c.id,
                                permissionOverwrites: [
                                    {
                                        id: message.guild.id,
                                        deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                        allow: [PermissionsBitField.Flags.SendMessages]
                                    }]
                            }).then(bot => {
                            // save dans la db l id du channel pour botlog
                            client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (botlog) VALUES ($1)`, [bot.id])
                            c.guild.channels.create({
                                name: "📁・logs-raid", 
                                type: 0,
                                parent: c.id,
                                permissionOverwrites: [
                                    {
                                        id: message.guild.id,
                                        deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                        allow: [PermissionsBitField.Flags.SendMessages]
                                    }]
                            }).then(raid => {
                            // save dans la db l id du channel pour raidlog
                            client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (raidlog) VALUES ($1)`, [raid.id])
                            c.guild.channels.create({
                                name: "📁・logs-guild", 
                                type: 0,
                                parent: c.id,
                                permissionOverwrites: [
                                    {
                                        id: message.guild.id,
                                        deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                        allow: [PermissionsBitField.Flags.SendMessages]
                                    }
                                ]
                            }).then(guild => {
                            // save dans la db l id du channel pour guildlog
                            client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (guildlog) VALUES ($1)`, [guild.id])
                            c.guild.channels.create({
                                name: "📁・logs-messages-edit",
                                type: 0,
                                parent: c.id,
                                permissionOverwrites: [
                                    {
                                        id: message.guild.id,
                                        deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                        allow: [PermissionsBitField.Flags.SendMessages]
                                    }
                                ]
                            }).then(mess => {
                            // save dans la db l id du channel pour messelog
                            client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (msgelog) VALUES ($1)`, [mess.id])
                            c.guild.channels.create({
                                name: "📁・logs-messages-bulkdel",
                                type: 0,
                                parent: c.id,
                                permissionOverwrites: [
                                    {
                                        id: message.guild.id,
                                        deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                        allow: [PermissionsBitField.Flags.SendMessages]
                                    }
                                ]
                            }).then(mess => {
                            // save dans la db l id du channel pour messelog
                            client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (msgbdlog) VALUES ($1)`, [mess.id])
                            c.guild.channels.create({
                                name: "📁・logs-commands",
                                type: 0,
                                parent: c.id,
                                permissionOverwrites: [
                                    {
                                        id: message.guild.id,
                                        deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                        allow: [PermissionsBitField.Flags.SendMessages]
                                    }
                                ]
                            }).then(command => {
                            // save dans la db l id du channel pour commandlogs
                            client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (commandlog) VALUES ($1)`, [command.id])
                            c.guild.channels.create({
                                name: "📁・logs-badword",
                                type: 0,
                                parent: c.id,
                                permissionOverwrites: [
                                    {
                                        id: message.guild.id,
                                        deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                        allow: [PermissionsBitField.Flags.SendMessages]
                                    }
                                ]
                            }).then(bad => {
                            // save dans la db l id du channel pour badwordlogs
                            client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (badwordlog) VALUES ($1)`, [bad.id])
                            c.guild.channels.create({
                                name: "📁・logs-flop",
                                type: 0,
                                parent: c.id,
                                permissionOverwrites: [
                                    {
                                        id: message.guild.id,
                                        deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                        allow: [PermissionsBitField.Flags.SendMessages]
                                    }
                                ]
                            }).then(flop => {
                            // save dans la db l id du channel pour floplogs
                            client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (floplog) VALUES ($1)`, [flop.id])
                            c.guild.channels.create({
                                name: "📁・logs-mention",
                                type: 0,
                                parent: c.id,
                                permissionOverwrites: [
                                    {
                                        id: message.guild.id,
                                        deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                        allow: [PermissionsBitField.Flags.SendMessages]
                                    }
                                ]
                            }).then(gmu => {
                                // save dans la db l id du channel pour gmulogs
                                client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (gmulog) VALUES ($1)`, [gmu.id])
                                c.guild.channels.create({
                                    name: "📁・logs-vocal-leave",
                                    type: 0,
                                    parent: c.id,
                                    permissionOverwrites: [
                                        {
                                            id: message.guild.id,
                                            deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                            allow: [PermissionsBitField.Flags.SendMessages]
                                        }
                                    ]
                                }).then(vl => {
                                // save dans la db l id du channel pour vllogs
                                client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (voiceleavelog) VALUES ($1)`, [vl.id])
                                c.guild.channels.create({
                                    name: "📁・logs-roles-delete",
                                    type: 0,
                                    parent: c.id,
                                    permissionOverwrites: [
                                        {
                                            id: message.guild.id,
                                            deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                            allow: [PermissionsBitField.Flags.SendMessages]
                                        }
                                    ]
                                }).then(roled => {
                                // save dans la db l id du channel pour roledlogs
                                client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (roledlog) VALUES ($1)`, [roled.id])
                                c.guild.channels.create({
                                    name: "📁・logs-roles-update",
                                    type: 0,
                                    parent: c.id,
                                    permissionOverwrites: [
                                        {
                                            id: message.guild.id,
                                            deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                            allow: [PermissionsBitField.Flags.SendMessages]
                                        }
                                    ]
                                }).then(roleu => {
                                // save dans la db l id du channel pour roleulogs
                                client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (roleulog) VALUES ($1)`, [roleu.id])
                                c.guild.channels.create({
                                    name: "📁・logs-emojis-delete",
                                    type: 0,
                                    parent: c.id,
                                    permissionOverwrites: [
                                        {
                                            id: message.guild.id,
                                            deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                            allow: [PermissionsBitField.Flags.SendMessages]
                                        }
                                    ]
                                }).then(emojid => {
                                // save dans la db l id du channel pour emojidlogs
                                client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (emojidlog) VALUES ($1)`, [emojid.id])
                                c.guild.channels.create({
                                    name: "📁・logs-emojis-update",
                                    type: 0,
                                    parent: c.id,
                                    permissionOverwrites: [
                                        {
                                            id: message.guild.id,
                                            deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                            allow: [PermissionsBitField.Flags.SendMessages]
                                        }
                                    ]
                                }).then(emojiu => {
                                // save dans la db l id du channel pour emojiulogs
                                client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (emojiulog) VALUES ($1)`, [emojiu.id])
                                c.guild.channels.create({
                                    name: "📁・logs-channel-delete",
                                    type: 0,
                                    parent: c.id,
                                    permissionOverwrites: [
                                        {
                                            id: message.guild.id,
                                            deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                            allow: [PermissionsBitField.Flags.SendMessages]
                                        }
                                    ]
                                }).then(channeld => {
                                // save dans la db l id du channel pour channeldlogs
                                client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (channeldlog) VALUES ($1)`, [channeld.id])
                                c.guild.channels.create({
                                    name: "📁・logs-channel-update",
                                    type: 0,
                                    parent: c.id,
                                    permissionOverwrites: [
                                        {
                                            id: message.guild.id,
                                            deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                            allow: [PermissionsBitField.Flags.SendMessages]
                                        }
                                    ]
                                }).then(channelu => {
                                // save dans la db l id du channel pour channelulogs
                                client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (channelulog) VALUES ($1)`, [channelu.id])
                                c.guild.channels.create({
                                    name: "📁・logs-bump",
                                    type: 0,
                                    parent: c.id,
                                }).then(bump => {
                                // save dans la db l id du channel pour bumplogs
                                client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (bumplog) VALUES ($1)`, [bump.id])
                                c.guild.channels.create({
                                    name: "📁・logs-channel-create",
                                    type: 0,
                                    parent: c.id,
                                    permissionOverwrites: [
                                        {
                                            id: message.guild.id,
                                            deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                                            allow: [PermissionsBitField.Flags.SendMessages]
                                        }
                                    ]
                                }).then(channelc => {
                                // save dans la db l id du channel pour channelclogs
                                client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (channelclog) VALUES ($1)`, [channelc.id])
                                })
                                })
                            })
                                })
                            })
                                })
                                })
                                })
                                })
                            })
                            })
                            })
                            })
                            })
                            })
                        })
            })

        })
      })
    })
})
    })
})
    })
})
    })
})
})
               })
            })
        })
      })
      message.author.send({
        embeds: [{
            author: {
                name: `${message.guild.name} Logs`, icon_url: message.guild.iconURL({dynamic: true}),
            },
            description: `La configuration des logs que vous avez demandé est terminer sur le serveur: ${message.guild.name}`,
            color: color,
            footer: client.config.footer
        }]
      }).catch(()=> {})
    } else if (args[0] === "min") {
        await client.db.none(`
        CREATE TABLE IF NOT EXISTS clarity_${client.user.id}_${message.guild.id}_logs (
            msglog VARCHAR(20),
            voicelog VARCHAR(20),
            modlog VARCHAR(20),
            emojilog VARCHAR(20),
            channellog VARCHAR(20),
            permlog VARCHAR(20),
            ticketlog VARCHAR(20),
            boostlog VARCHAR(20),
            joinleavelog VARCHAR(20),
            rolelog VARCHAR(20),
            guildlog VARCHAR(20)
        )
    `)
    const color = parseInt(client.color.replace("#", ""), 16);
    let msg = await message.channel.send({ content: `Création de la **catégorie** des logs en cours..` }).then(msg => {
        message.guild.channels.create( {
            name: `${message.guild.name}・LOGS`,
          type: 4,
          permissionOverwrites: [
            {
              id: message.guild.id,
              deny: ["ViewChannel"],
              allow: ["SendMessages"]
            },
          ],
        }).then(c => {
            c.setPosition(0)
            c.guild.channels.create({
                name: "📁・logs-messages",
                type: 0,
                parent: c.id,
                permissionOverwrites: [
                    {
                        id: message.guild.id,
                        deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                        allow: [PermissionsBitField.Flags.SendMessages]
                    },
                ],
               }).then(mess => {
                client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (msglog) VALUES ($1)`, [mess.id])
                c.guild.channels.create({
                    name: "📁・logs-boosts",
                    type: 0,
                    parent: c.id,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                            allow: [PermissionsBitField.Flags.SendMessages]
                        },
                    ],
                }).then(boost => {
                client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (boostlog) VALUES ($1)`, [boost.id])
                c.guild.channels.create({
                    name: "📁・logs-join-leave",
                    type: 0,
                    parent: c.id,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                            allow: [PermissionsBitField.Flags.SendMessages]
                        },
                    ],
                }).then(join => {
                client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (joinleavelog) VALUES ($1)`, [join.id])
                c.guild.channels.create({
                    name: "📁・logs-roles",
                    type: 0,
                    parent: c.id,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                            allow: [PermissionsBitField.Flags.SendMessages]
                        },
                    ],
                }).then(role => {
                client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (rolelog) VALUES ($1)`, [role.id])
                c.guild.channels.create({
                    name: "📁・logs-voice",
                    type: 0,
                    parent: c.id,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                            allow: [PermissionsBitField.Flags.SendMessages]
                        },
                    ],
                }).then(voice => {
                client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (voicelog) VALUES ($1)`, [voice.id])
                c.guild.channels.create({
                    name: "📁・logs-mod",
                    type: 0,
                    parent: c.id,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                            allow: [PermissionsBitField.Flags.SendMessages]
                        },
                    ],
                }).then(mod => {
                client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (modlog) VALUES ($1)`, [mod.id])
                c.guild.channels.create({
                    name: "📁・logs-emojis",
                    type: 0,
                    parent: c.id,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                            allow: [PermissionsBitField.Flags.SendMessages]
                        },
                    ],
                }).then(emoji => {
                client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (emojilog) VALUES ($1)`, [emoji.id])
                c.guild.channels.create({
                    name: "📁・logs-tickets",
                    type: 0,
                    parent: c.id,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                            allow: [PermissionsBitField.Flags.SendMessages]
                        },
                    ],
                }).then(ticket => {
                client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (ticketlog) VALUES ($1)`, [ticket.id])
                c.guild.channels.create({
                    name: "📁・logs-channels",
                    type: 0,
                    parent: c.id,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                            allow: [PermissionsBitField.Flags.SendMessages]
                        },
                    ],
                }).then(channel => {
                client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (channellog) VALUES ($1)`, [channel.id])
                c.guild.channels.create({
                    name: "📁・logs-perm",
                    type: 0,
                    parent: c.id,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                            allow: [PermissionsBitField.Flags.SendMessages]
                        },
                    ],
                }).then(perm => {
                client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (permlog) VALUES ($1)`, [perm.id])
                c.guild.channels.create({
                    name: "📁・logs-guild",
                    type: 0,
                    parent: c.id,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                            allow: [PermissionsBitField.Flags.SendMessages]
                        },
                    ],
                }).then(guild => {
                client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_logs (guildlog) VALUES ($1)`, [guild.id])
            })
        })
    })
                })
                })
                })
                })
            })
        })
                })
               })
        })
    })
    message.author.send({
        embeds: [{
            author: {
                name: `${message.guild.name} Logs`, icon_url: message.guild.iconURL({dynamic: true}),
            },
            description: `La configuration des logs que vous avez demandé est terminer sur le serveur: ${message.guild.name}`,
            color: color,
            footer: client.config.footer
        }]
      }).catch(()=> {})
    }
}
}