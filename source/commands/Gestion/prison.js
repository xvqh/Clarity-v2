export default {
    name: 'prison',
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
        await client.db.none(`
          CREATE TABLE IF NOT EXISTS clarity_${client.user.id}_${message.guild.id}_prison (
              user_id VARCHAR(20) PRIMARY KEY
          )`);
        await client.db.none(`
          CREATE TABLE IF NOT EXISTS clarity_${client.user.id}_prison (
              user_id VARCHAR(20) PRIMARY KEY
          )`);
        let msg = await message.channel.send({ content: 'Chargement du module en cours.' })
        await update(client, message, msg, args)
    }
}
async function update(client, message, msg, args) {
    let prison = await client.db.any(`
                SELECT * FROM clarity_${client.user.id}_${message.guild.id}_prison
            `);
    let prisonTag = await Promise.all(prison.map(async (prison) => `[${(await client.users.fetch(prison.user_id)).tag}](https://discord.com/users/${prison.user_id}) (${prison.user_id})`));
    msg.edit({
        content: null, embeds: [{
            color: parseInt(client.color.replace("#", ""), 16),
            title: message.guild.name + " prison",
            description: prisonTag.join('\n'),
            footer: client.config.footer
        }], components: [{
            type: 1,
            components: [{
                type: 2,
                emoji: '➕',
                style: 2,
                custom_id: 'addmember' + message.id
            }, {
                type: 2,
                emoji: '➖',
                style: 2,
                custom_id: 'removemember' + message.id
            }, {
                type: 2,
                emoji: '❌',
                style: 2,
                custom_id: 'close' + message.id
            }]
        }]
    })
    const collector = msg.createMessageComponentCollector({
        filter: (i) => i.user.id === message.author.id,
        time: 60000 * 10 * 3
    })
    collector.on("collect", async (i) => {
        const color = parseInt(client.color.replace("#", ""), 16)
        i.deferUpdate();
        if (i.customId === 'back' + message.id) {
            let prison = await client.db.any(`
                SELECT * FROM clarity_${client.user.id}_${message.guild.id}_prison
            `);
            let prisonTag = await Promise.all(prison.map(async (prison) => `[${(await client.users.fetch(prison.user_id)).tag}](https://discord.com/users/${prison.user_id}) (${prison.user_id})`));
            msg.edit({
                content: null, embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    title: message.guild.name + " prison",
                    description: prisonTag.join('\n'),
                    footer: client.config.footer
                }], components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        emoji: '➕',
                        style: 2,
                        custom_id: 'addmember' + message.id
                    }, {
                        type: 2,
                        emoji: '➖',
                        style: 2,
                        custom_id: 'removemember' + message.id
                    }, {
                        type: 2,
                        emoji: '❌',
                        style: 2,
                        custom_id: 'close' + message.id
                    }]
                }]
            })
        }
        else if (i.customId === `close${message.id}`) {
            collector.stop()
            msg.delete()
        }
        else if (i.customId === 'addmember' + message.id) {
            try {
                const userQuestion = await message.reply({ content: "Veuillez envoyer l'id de l'utilisateur que vous souhaitez  mettre en prison" });

                const collected = await message.channel.awaitMessages({
                    filter: (m) => m.author.id === message.author.id,
                    max: 1,
                    time: 10000
                });

                const msg = collected.first();
                let user;

                user = message.guild.members.cache.get(msg.content);
                if (!user) {
                    user = await message.guild.members.fetch(msg.content).catch(() => null);
                }

                if (!user) {
                    await userQuestion.edit({ content: `Aucun membre trouvé pour \`${msg.content || "rien"}\`` });
                    await msg.delete();
                    return userQuestion.delete({ timeout: 5000 });
                }

                await client.db.none(
                    `INSERT INTO clarity_${client.user.id}_${message.guild.id}_prison VALUES ($1)`,
                    [user.id]
                );

                // recupere les roles et les enregistres dans une table de la db prison pour les remettres a l utilisateur quand il sortira de prison
                try {
                    const roles = await user.roles.cache;
                    let dbroles = await client.data2.get(`oldroles_${message.guild.id}_${user.id}`) || {
                        roles: []
                    };
                    // set roles in db
                    dbroles.roles = roles.map((role) => role.id);
                    await client.data2.set(`oldroles_${message.guild.id}_${user.id}`, dbroles);
                    // remove oldroles of the user
                    await user.roles.remove(roles.map((role) => role.id));
                    let prisonrole = await client.data.get(`prisondata_${message.guild.id}`) || {
                        channel: null,
                        role: [],
                        status: false
                    }
                    if (prisonrole.role) {
                        await user.roles.add(prisonrole.role);
                    }
                    // si le membre est en voc le deco
                    if (user.voice.channel) {
                        await user.voice.setChannel(null);
                    }
                } catch (error) {
                    console.error(`Erreur lors de l arrestation de ${user.user.tag}: ${error.message}`);
                }

                const replyMessage = await userQuestion.reply({ content: `Le membre \`${user.user.tag}\` a été mis en prison` });

                // Suppression du message de réponse après 5 secondes
                setTimeout(() => {
                    replyMessage.delete();
                }, 5000);

                await userQuestion.delete({ timeout: 5000 });
                await msg.delete();
            } catch (error) {
                console.error('Erreur lors de la gestion de la commande addmember:', error);
            }

            let prison = await client.db.any(`
                SELECT * FROM clarity_${client.user.id}_${message.guild.id}_prison
            `);

            let color = parseInt(client.color.replace('#', ''), 16);
            let prisonTag = await Promise.all(prison.map(async (prison) => `[${(await client.users.fetch(prison.user_id)).tag}](https://discord.com/users/${prison.user_id}) (${prison.user_id})`));

            msg.edit({
                embeds: [{
                    title: message.guild.name + " prison",
                    description: prisonTag.join('\n'),
                    color: color,
                    footer: client.config.footer
                }],
                components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        emoji: '➕',
                        style: 2,
                        custom_id: 'addmember' + message.id
                    }, {
                        type: 2,
                        emoji: '➖',
                        style: 2,
                        custom_id: 'removemember' + message.id
                    }, {
                        type: 2,
                        emoji: '❌',
                        style: 2,
                        custom_id: 'close' + message.id
                    }]
                }]
            });
        }


        else if (i.customId === 'removemember' + message.id) {
            let question = await message.channel.send({ content: "Veuillez envoyer l'id de l'utilisateur que vous souhaitez retirer de la prison" });

            try {
                const collected = await message.channel.awaitMessages({
                    filter: (m) => m.author.id === message.author.id,
                    max: 1,
                    time: 10000
                });

                const msg = collected.first();
                const user = await message.guild.members.fetch(msg.content).catch(() => null);

                if (!user) {
                    await question.edit({ content: `Aucun membre trouvé pour \`${msg.content || "rien"}\`` });
                    await msg.delete();
                    return question.delete();
                }

                try {
                    await client.db.none(
                        `DELETE FROM clarity_${client.user.id}_${message.guild.id}_prison WHERE user_id = $1`,
                        [user.id]
                    );
                    await message.reply({ content: `${user.user.tag} a été libéré par ${message.author.tag}. Il vient de sortir de prison` });



                    // re attribut les anciens roles de l utilisateur
                    let dbroles = await client.data2.get(`oldroles_${message.guild.id}_${user.id}`) || {
                        roles: []
                    };
                    // map the roles
                    let roles = dbroles.roles.map((role) => message.guild.roles.cache.get(role));
                    await user.roles.add(roles);
                    let prisonrole = await client.data.get(`prisondata_${message.guild.id}`) || {
                        channel: null,
                        role: [],
                        status: false
                    }
                    if (prisonrole.role) {
                        await user.roles.remove(prisonrole.role);
                    }



                    console.log(`Suppression réussie pour l'utilisateur avec l'ID ${user.id}`);
                } catch (error) {
                    console.error(`Erreur lors de la suppression : ${error}`);
                }
            } catch (error) {
                console.error('Erreur lors de la gestion de la commande removemember:', error);
            }

            let prison = await client.db.any(`
                SELECT * FROM clarity_${client.user.id}_${message.guild.id}_prison
            `);

            let color = parseInt(client.color.replace('#', ''), 16);
            let prisonTag = await Promise.all(prison.map(async (prison) => `[${(await client.users.fetch(prison.user_id)).tag}](https://discord.com/users/${prison.user_id}) (${prison.user_id})`));

            msg.edit({
                embeds: [{
                    title: message.guild.name + " prison",
                    description: prisonTag.join('\n'),
                    color: color,
                    footer: client.config.footer
                }],
                components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        emoji: '➕',
                        style: 2,
                        custom_id: 'addmember' + message.id
                    }, {
                        type: 2,
                        emoji: '➖',
                        style: 2,
                        custom_id: 'removemember' + message.id
                    }, {
                        type: 2,
                        emoji: '❌',
                        style: 2,
                        custom_id: 'close' + message.id
                    }]
                }]
            });
        }



    })
    collector.on("end", async () => {
        msg.edit({
            content: null,
            embeds: null,
            components: null
        })
    })

}