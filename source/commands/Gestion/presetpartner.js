module.exports = {
    name: "presetpartner",
    run: async(client, message ,args) => {
        const isOwn = await client.db.oneOrNone(
            `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
            [message.author.id]
          );
          if (!isOwn) {
            return message.reply({
              content: "Vous n'avez pas la permission d'utiliser cette commande",
            });
          }
          if (args == "all") {
            await client.db.none(`
            CREATE TABLE IF NOT EXISTS clarity_${client.user.id}_${message.guild.id}_partner (
                partnerask VARCHAR(20),
                partnerlog VARCHAR(20)
            )
        `)
        let msg = await message.channel.send({ content: `Création de la **catégorie** des partenariats en cours..` }).then(msg => {
            message.guild.channels.create( {
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
                            deny: [PermissionsBitField.Flags.SendMessages],
                            allow: [PermissionsBitField.Flags.ViewChannel]
                        },
                    ],
                   }).then(async (part) => {
                    client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_parnter (partnerask) VALUES ($1)`, [part.id])
                    await part.send({embeds: [{
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
                    }]})
                    c.guild.channels.create({
                        name: "🤝・Partenariat",
                        type: 0,
                        parent: c.id,
                        permissionOverwrites: [
                            {
                                id: message.guild.id,
                                deny: [PermissionsBitField.Flags.SendMessages],
                                allow: [PermissionsBitField.Flags.ViewChannel]
                            },
                        ],
                       }).then(newpart => {
                       client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_partner (partner) VALUES ($1)`, [newpart.id])
                       })
                   })
            })
        })
        message.author.send({
            embeds: [{
                author: {
                    name: `${message.guild.name} Partenariat`, icon_url: message.guild.iconURL({dynamic: true}),
                },
                description: `La configuration des partenariats que vous avez demandé est terminer sur le serveur: ${message.guild.name}`,
                color: color,
                footer: client.config.footer
            }]
        })
          }
          else if (args == "min") {
            await client.db.none(`
            CREATE TABLE IF NOT EXISTS clarity_${client.user.id}_${message.guild.id}_partner (
                partnerask VARCHAR(20),
                partnerlog VARCHAR(20)
            )
        `)
        let msg = await message.channel.send({ content: `Création de la **catégorie** des partenariats en cours..` }).then(msg => {
            message.guild.channels.create( {
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
                            deny: [PermissionsBitField.Flags.SendMessages],
                            allow: [PermissionsBitField.Flags.ViewChannel]
                        },
                    ],
                   }).then(part => {
                    client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_parnter (partnerask) VALUES ($1)`, [part.id])
                    c.guild.channels.create({
                        name: "🤝・Partenariat",
                        type: 0,
                        parent: c.id,
                        permissionOverwrites: [
                            {
                                id: message.guild.id,
                                deny: [PermissionsBitField.Flags.SendMessages],
                                allow: [PermissionsBitField.Flags.ViewChannel]
                            },
                        ],
                       }).then(newpart => {
                       client.db.none(`INSERT INTO clarity_${client.user.id}_${message.guild.id}_partner (partner) VALUES ($1)`, [newpart.id])
                       })
                   })
            })
        })
        message.author.send({
            embeds: [{
                author: {
                    name: `${message.guild.name} Partenariat`, icon_url: message.guild.iconURL({dynamic: true}),
                },
                description: `La configuration des partenariats que vous avez demandé est terminer sur le serveur: ${message.guild.name}`,
                color: parseInt(client.color.replace("#", ""), 16),
                footer: client.config.footer
            }]
        })
          }
    }
}