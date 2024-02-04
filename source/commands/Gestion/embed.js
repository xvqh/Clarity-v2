const Discord = require("discord.js")
const ms = require('ms')
module.exports = {
    name: "embed",
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
        let embed = new Discord.EmbedBuilder()
        .setDescription("** **")

        const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.StringSelectMenuBuilder()
            .setCustomId("embed_build" + message.id)
            .setPlaceholder("Choisissez une option")
            .addOptions([
                {
                    label: "Titre",
                    value: "title_" + message.id,
                    emoji: "✏️"
                },
                {
                    label: "Description",
                    value: "description_" + message.id,
                    emoji: "💬"
                },
                {
                    label: "Ajouter un Field", 
                    value: "fields_"+ message.id, 
                    emoji: "➕"
                },
                {
                    label: "Retirer un Field", 
                    value: "delfields_" + message.id,
                    emoji: "➖"
                },
                {
                    label: "Thumbnail",
                    value: "thumbnail_" + message.id,
                    emoji: "🏷️"
                },{
                    label: "Image",
                    value: "image_" + message.id,
                    emoji: "🖼️"
                },{
                    label: "Couleur",
                    value: "couleur_" + message.id,
                    emoji: "🔴"
                },{
                    label: "Footer",
                    value: "footer_" + message.id,
                    emoji: "🔻"
                },{
                    label: "Auteur",
                    value: "auteur_" + message.id,
                    emoji: "🔸"
                },{
                    label: "Timestamp",
                    value: "timestamp_" + message.id,
                    emoji: "🕐"
                }, {
                    label: "URL",
                    value: "url_" + message.id,
                    emoji: "🔗"
                }
            ])
        )
        const row2 = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
            .setCustomId("buttonenable_" + message.id)
            .setEmoji("✅")
            .setStyle(2),
            new Discord.ButtonBuilder()
            .setCustomId("buttoncopy_" + message.id)
            .setEmoji("📑")
            .setStyle(2),
            new Discord.ButtonBuilder()
            .setCustomId("buttoncancel_" + message.id)
            .setEmoji("❌")
            .setStyle(1)
        )

        let msg = await message.channel.send({embeds: [embed], components: [row, row2]})
        const collector = message.channel.createMessageComponentCollector({ filter: m => m.user.id == message.author.id, componentType: Discord.ComponentType.StringSelect, time: ms("2m") })
        collector.on("collect", async(interaction) => {
            if (interaction.values[0] === "title_" + message.id) {
                interaction.reply("Quel est **le titre** que vous-voulez ajouter à votre embed ?")
                message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1, time: ms('2m'), errors: ["time"] }).then((collected) => {
                    collected.first().delete();
                    interaction.deleteReply();
                    embed.setTitle(collected.first().content)
                    msg.edit({ embeds: [embed] });
                }).catch(async err => message.channel.send("Vous avez pris trop de temps pour communiquer."))
            }
            if (interaction.values[0] === "description_" + message.id) {
                interaction.reply("Quel est **la description** que vous-voulez ajouter à votre embed ?")
                message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1, time: ms('2m'), errors: ["time"] }).then((collected) => {
                    collected.first().delete();
                    interaction.deleteReply();
                    embed.setDescription(collected.first().content)
                    msg.edit({ embeds: [embed] });
                }).catch(async err => message.channel.send("Vous avez pris trop de temps pour communiquer."))
            }
            if (interaction.values[0] === "thumbnail_"+ message.id) {
                interaction.reply("Quel est **le thumbnail** que vous-voulez ajouter à votre embed ?")
                
                message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1, time: ms('2m'), errors: ["time"] }).then((collected) => {
                    let image = collected.first().attachments.first()?.url;
                    if (!image) {
                        interaction.deleteReply();
                        collected.first().delete();
                        return message.channel.send("Image ou lien invalide.");
                    }
                    collected.first().delete();
                    interaction.deleteReply();
                    embed.setThumbnail(image)
                    msg.edit({ embeds: [embed] });
                }).catch(async err => message.channel.send("Vous avez pris trop de temps pour communiquer."))
            }
            if (interaction.values[0] === "image_" + message.id) {
                interaction.reply("Quel est **l'image** que vous-voulez ajouter à votre embed ?")
                message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1, time: ms('2m'), errors: ["time"] }).then((collected) => {
                    let image = collected.first().attachments.first()?.url;
                    if (!image) {
                        interaction.deleteReply();
                        collected.first().delete();
                        return message.channel.send("Image ou lien invalide.");
                    }
                    collected.first().delete();
                    interaction.deleteReply();
                    embed.setImage(image)
                    msg.edit({ embeds: [embed] });
                }).catch(async err => message.channel.send("Vous avez pris trop de temps pour communiquer."))
            }
            if (interaction.values[0] === "couleur_" + message.id) {
                interaction.reply("Quel est **la couleur** que vous-voulez ajouter à votre embed ?")
                message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1, time: ms('2m'), errors: ["time"] }).then((collected) => {
                    const content = collected.first().content.toLowerCase(); 

                    const colors = {
                        "noir": "#000000",
                        "black": "#000000",
                        "blanc": "#ffffff",
                        "white": "#ffffff",
                        "jaune": "#FFFF00",
                        "yellow": "#FFFF00",
                        "bleu": "#0000FF",
                        "blue": "#0000FF",
                        "violet": "#764686",
                        "purple": "#764686",
                        "gris": "#808080",
                        "gray": "#808080",
                        "grey": "#808080",
                        "orange": "#FFA500",
                        "vert": "#00FF00",
                        "green": "#00FF00",
                        "rouge": "#FF0000",
                        "red": "#FF0000",
                        "maron": "#582900",
                        "brown": "#582900",
                        "rose": "#dc14eb",
                        "pink": "#dc14eb",
                        "beige": "#F5F5DC"
                    };

                    const selectedColor = colors[content];

                    if (selectedColor) {
                        collected.first().delete().catch(() => { });
                        embed.setColor(selectedColor);
                        msg.edit({ embeds: [embed] });
                    } else {
                        collected.first().delete().catch(() => {});
                        embed.setColor(content);
                        msg.edit({ embeds: [embed] });
                    }
                }).catch(async err => message.channel.send("Vous avez pris trop de temps pour communiquer"))
            }
            if (interaction.values[0] === "footer_" + message.id) {
                interaction.reply("Quel est **le footer** que vous-voulez ajouter à votre embed ?")
                message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1, time: ms('2m'), errors: ["time"] }).then((collected) => {
                    interaction.deleteReply();
                    collected.first().delete();
                    message.channel.send("Quel est **l'image de footer** de votre embed ? Si vous ne voulez pas envoyez `aucun`.")
                    message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, time: ms('2m'), errors: ["time"], max: 1 }).then(async (collected2) => {
                        message.delete();
                        collected2.first().delete();
                        if (collected2.first().content === ("aucun")) {
                            message.delete();
                            embed.setFooter({ text: `${collected.first().content}` })
                            msg.edit({ embeds: [embed] });
                        } else {
                            let image = collected2.first().attachments.first()?.url;
                            if (!image) {
                                message.channel.send("Image ou lien invalide.");
                                message.delete();
                            }
                            embed.setFooter({ text: `${collected.first().content}`, iconURL: image })
                            msg.edit({ embeds: [embed] });
                        }
                    })
                }).catch(async err => message.channel.send("Vous avez pris trop de temps pour communiquer."))
            }
            if (interaction.values[0] === "url_" + message.id) {
                interaction.reply("Quel est **l'url** que vous-voulez ajouter à votre embed ?")
                message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1, time: ms('2m'), errors: ["time"] }).then((collected) => {
                    interaction.deleteReply();
                    collected.first().delete();
                    embed.setURL(`${collected.first().content}`)
                    msg.edit({ embeds: [embed] });
                }).catch(async err => message.channel.send("Vous avez pris trop de temps pour communiquer."))
            }
            if (interaction.values[0] === "timestamp_" + message.id) {
                interaction.reply("Voulez-vous vraiment ajouter un **timestamp** à votre embed ? Oui/Non.")
                message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1, time: ms('2m'), errors: ["time"] }).then((collected) => {
                    if (collected.first().content === "oui" || "yes" && collected.first().content === "Oui" || "Yes") {
                        embed.setTimestamp()
                        msg.edit({ embeds: [embed] });
                    }
                    else if (collected.first().content === "non" || "no" && collected.first().content === "Non" || "no") {
                        return;
                    }
                }).catch(async err => message.channel.send("Vous avez pris trop de temps pour communiquer."))
            }
            if (interaction.values[0] === "fields_" + message.id){
                interaction.reply("Quel est **le titre** du field que vous voulez ajouter à l'embed.");
                    message.channel
                        .awaitMessages({
                            filter: (m) => m.author.id === message.author.id,
                            max: 1,
                            time: ms('2m'),
                            errors: ["time"],
                        })
                        .then(async (collected) => {
                            if (collected.first().content.length > 28) return message.channel.send(await client.lang(`embed.long`));
                            interaction.deleteReply();
                            collected.first().delete();
                            message.channel.send("Quel est **la description** du field que vous voulez ajouter à l'embed.");
                            message.channel
                                .awaitMessages({
                                    filter: (m) => m.author.id === message.author.id,
                                    max: 1,
                                    time: ms('2m'),
                                    errors: ["time"],
                                })
                                .then(async (collect2) => {
                                    if (!message.deleted) message.delete();
                                    collect2.first().delete();
                                    embed.addFields({ name: `${collected.first().content}`, value: `${collect2.first().content}` });
                                    msg.edit({ embeds: [embed] });
                                })
                                .catch(async (err) => message.channel.send("Vous avez pris trop de temps pour communiquer."));
                        })
                        .catch(async (err) => message.channel.send("Vous avez pris trop de temps pour communiquer."));
            }
            if (interaction.values[0] === "delfields_" + message.id){
                if (embed.fields.length < 1) return message.channel.send("Il n'y a aucun field.");
                interaction.reply("Quel est le numéro du field à retiré ?");
                message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1, time: ms('2m'), errors: ["time"] }).then(async (co) => {
                    co.first().delete();
                    interaction.deleteReply();

                    if (isNaN(co.first().content)) return message.channel.send("Veuillez donner un nombre valide.");
                    if (co.first().content > embed.fields.length) return message.channel.send("Veuillez donner un nombre valide.");
                    var indexField = Number(co.first().content) - 1;
                    embed.spliceFields(indexField, 1);
                    msg.edit({ embeds: [embed] });
                })
            }
        })
        const collector2 = message.channel.createMessageComponentCollector({ filter: m => m.user.id == message.author.id, componentType: Discord.ComponentType.Button, time: ms("2m") })
        collector2.on('collect', async (interaction) => {
            const value = interaction.customId;

            if (value === "buttonenable_" + message.id) {
                const channel = new Discord.ChannelSelectMenuBuilder()
                    .setCustomId('embedchannel_' + message.id)
                    .setMaxValues(1)
                    .setMaxValues(1)
                    .setChannelTypes(0);
                const row = new Discord.ActionRowBuilder()
                    .addComponents(channel);

                interaction.update({ embeds: [], content: "Veuillez m'indiquer un salon.", components: [row] })
            }
            if (value === "buttondisable_" + message.id) {
                msg.delete();

            }
            if (value === "buttoncopy_" + message.id) {
                await message.channel.send("Quel est le channel ou se trouve l'embed ?");

                message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1, time: ms('2m'), errors: ["time"] })
                    .then(async (collected) => {
                        const embedChannel = collected.first().content;
                        console.log(embedChannel);

                        const channel = message.guild.channels.cache.find(ch => ch.name === embedChannel || ch.id === embedChannel);
                        if (!channel) {
                            return message.channel.send("Le channel donner est invalide.");
                        }

                        await message.channel.send("Quel est le message de l'embed a copier ?");

                        message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, time: ms('2m'), errors: ["time"], max: 1 })
                            .then(async (collected2) => {
                                const embedMessage = collected2.first().content;
                                console.log(embedMessage);

                                const parsedEmbed = JSON.parse(embedMessage);
                                console.log(parsedEmbed)
                                console.log(parsedEmbed)

                                collected2.first().delete();
                                collected.first().delete();
                            })
                            .catch(async err => {
                                message.channel.send("Vous avez pris trop de temps pour communiquer.");
                            });
                    })
                    .catch(async err => {
                    });
            }

                    
            else if (value === "buttondisable_" + message.id) {
                msg.delete();

            }
        })
        client.on('interactionCreate', async (i) => {
            if (message.author.id === i.user.id) {
                if (i.customId === `embedchannel_${message.id}`) {
                    const channelid = i.values
                    const channel = await client.channels.fetch(channelid)
                    channel.send({ embeds: [embed] });
                    i.update({ content: `L'embed a bien été envoyé dans <#${channel.id}>`, embeds: [], components: [] })

                }
            }
        }
        )
    }
    }
