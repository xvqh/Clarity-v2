module.exports = {
    name: 'saverole',
    run: async(client, message, args) => {
        if (client.config.devs.includes(message.author.id)) {
            let msg = await message.channel.send({content: 'Module en cours de chargement. . .'})
            let user = message.mentions.users.first() || client.users.cache.get(args[0]);
            msg.edit({
                content: null,
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    title: `Roles de ${user.username}`,
                    description: roles.map(role => `<@&${role}>`).join('\n'),
                    footer: client.config.footer,
                    timestamp: new Date()
                }],
                components : [{
                    type: 1,
                    components: [{
                        type: 3,
                        custom_id: 'gestion' + message.id,
                        placeholder: 'Choisis une option',
                        options: [{
                            label: 'Sauvegarder les roles',
                            value: 'save'
                        }]
                    }]
                }]
            })

            const filter = (i) => i.user.id === message.author.id

            const collector = message.channel.createMessageComponentCollector({ filter, time: 60000*10*3 })
            collector.on('collect', async(i) => {
                if (i.customId == 'gestion' + message.id)  {
                    if (i.values[0] == ('save')) {
                        let id = Date.now().toString()
                        let roles = await user.roles.cache.map(role => role.id);
                        let db = await client.data2.get(`rolesave_${message.guild.id}_${user.id}_${id}`) || {
                            roles: [],
                            savedate: Date.now()
                        }
                        
                        // set in the db
                        db.roles = roles
                        db.savedate = Date.now()
                        await client.data2.set(`rolesave_${message.guild.id}_${user.id}_${id}`, db)
                        i.reply({
                            content: 'Sauvegarde effectuee avec succes',
                            ephemeral: true
                        })
                    }
                }
            })



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
            let msg = await message.channel.send({content: 'Module en cours de chargement. . .'})
            let user = message.mentions.users.first() || client.users.cache.get(args[0]);
            msg.edit({
                content: null,
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    title: `Roles de ${user.username}`,
                    description: roles.map(role => `<@&${role}>`).join('\n'),
                    footer: client.config.footer,
                    timestamp: new Date()
                }],
                components : [{
                    type: 1,
                    components: [{
                        type: 3,
                        custom_id: 'gestion' + message.id,
                        placeholder: 'Choisis une option',
                        options: [{
                            label: 'Sauvegarder les roles',
                            value: 'save'
                        }]
                    }]
                }]
            })

            const filter = (i) => i.user.id === message.author.id

            const collector = message.channel.createMessageComponentCollector({ filter, time: 60000*10*3 })
            collector.on('collect', async(i) => {
                if (i.customId == 'gestion' + message.id)  {
                    if (i.values[0] == ('save')) {
                        let id = Date.now().toString()
                        let roles = await user.roles.cache.map(role => role.id);
                        let db = await client.data2.get(`rolesave_${message.guild.id}_${user.id}_${id}`) || {
                            roles: [],
                            savedate: Date.now()
                        }
                        
                        // set in the db
                        db.roles = roles
                        db.savedate = Date.now()
                        await client.data2.set(`rolesave_${message.guild.id}_${user.id}_${id}`, db)
                        i.reply({
                            content: 'Sauvegarde effectuee avec succes',
                            ephemeral: true
                        })
                    }
                }
            })
        }
    }
}