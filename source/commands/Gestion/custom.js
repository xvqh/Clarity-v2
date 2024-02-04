

module.exports = {
    name: 'custom',
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
        if (!args[0]) {
            return message.reply({
                content: `Veuillez utiliser \`${client.prefix}custom create\` ou \`${client.prefix}custom delete\``,
            });
        }
        if (args[0] === 'create') {
            await create(client, message, args);
        }
    }
}

async function create(client, message, args) {
    let name = args[1];

    if (!name) {
        return message.reply({
            content: 'Veuillez indiquer le nom de la commande'
        });
    }

    try {
        const existingCommand = await client.db.oneOrNone(
            'SELECT * FROM custom_commands WHERE guild_id = $1 AND LOWER(name) = LOWER($2)',
            [message.guild.id, name]
        );

        if (existingCommand) {
            return message.reply({
                content: 'La commande existe déjà sur ce serveur'
            });
        } else {
            await message.channel.send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    fields: [{
                        name: 'Nom de la commande',
                        value: name.toLowerCase()
                    }]
                }],
                components: [{
                    type: 1,
                    components: [{
                        type: 3,
                        custom_id: 'custom' + message.id,
                        options: [
                            {
                                label: `Embed`,
                                description: `Envoie un message en embed`,
                                value: "command-embed",
                            },
                            {
                                label: `Normal`,
                                description: `Envoie un message normal`,
                                value: "command-normal",
                            },
                            {
                                label: `Messages Privés`,
                                description: `Envoie le message en MP`,
                                value: "command-dm",
                            }
                        ]
                    }]
                }]
            });

            const filter = i => i.user.id === message.author.id
            const collector = message.channel.createMessageComponentCollector({filter, time: 15000})

            collector.on('collect', async i => {
                if (i.customId === 'custom' + message.id) {
                    await i.deferUpdate();
                    let action, response;

                    if (i.values[0] === "command-embed" || i.values[0] === "command-normal" || i.values[0] === "command-dm") {
                        let question = await i.channel.send({content: 'Quel est la nouvelle reponse ?'});
                        let rep = await i.channel.awaitMessages({filter: m => m.author.id == i.user.id, max: 1, time: 30_000});
                        await rep.first().delete();
                        await question.delete();
                        response = rep.first().content;

                        if (i.values[0] === "command-embed") {
                            action = "Embed";
                        } else if (i.values[0] === "command-normal") {
                            action = "Normal";
                        } else if (i.values[0] === "command-dm") {
                            action = "DM";
                        }

                        // Insert the new command into the database
                        await client.db.none(
                            'INSERT INTO custom_commands(guild_id, name, action, response) VALUES($1, $2, $3, $4)',
                            [message.guild.id, name.toLowerCase(), action, response]
                        );

                        return message.reply({
                            content: 'Commande créée avec succès!'
                        });
                    }
                }
            })
        }
    } catch(e) {
        console.error(e)
    }
}


