import { EmbedBuilder ,ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder } from "discord.js";
export default {
    name: "secur",
    category: "Anti-raid",
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
          let msg = await message.channel.send({content: "Chargement du module en cours . . ."})
          await update(client, msg, message)
    }
}

async function update(client, msg, message) {
    const data = await client.data2.get(`antiraid_${message.guild.id}`) || {
        antiban: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null,
            sensibility: "1/j"
        },
        antispam: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            ignore_channels: [],
            ignore_channels_enabled: false,
            sanctions: null,
            sensibility: "1/s",
            rep: false
        },
        antilink: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            ignore_channels: [],
            ignore_channels_enabled: false,
            sanctions: null,
            sensibility: "1/s",
            rep: false
        },
        antimention: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            ignore_channels: [],
            ignore_channels_enabled: false,
            sanctions: null,
            sensibility: "1/s",
            rep: false
        },
        antikick: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null,
            sensibility: "1/j"
        },
        antibot: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null
        },
        antiupdate: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null
        },
        antirolecreate: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null
        },
        antiroledelete: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null
        },
        antiroleupdate: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null
        },
        antichannelcreate: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null
        },
        antichanneldelete: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null
        },
        antichannelupdate: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null
        },
        antiwebhookcreate: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null
        },
        antiwebhookdelete: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null
        },
        antiwebhookupdate: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null
        },
        antiinvite: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null
        },
        antiemojicreate: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null
        },
        antiemojidelete: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null
        },
        antiemojiupdate: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null
        },
        antiadmin: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null
        },
        antiscam: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null
        },
        antibadword: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null,
            sensibility: "1/m",
            badwords: [],
            rep: false
        },
        antimassmention: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null
        },
        antimassban: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null
        },
        antimasskick: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null
        },
        antimasslink: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null
        },
        antiembed: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null,
            rep: false
        },
        antithreadcreate: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null
        },
        antithreaddelete: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null
        },
        antithreadupdate: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: [],
            sanctions: null
        },
        antitoxicity: {
            status: false,
            logs: null,
            logs_enabled: false,
            wl_status : false,
            wl_users: [],
            wl_roles: []
        }
    }

    const baseEmbed = new EmbedBuilder()
        .setColor(parseInt(client.color.replace("#", ""), 16))
        .setTimestamp(new Date())
        .setFooter({ text: client.config.footer.text })
        .setAuthor({name: message.author.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true })})
        .setTitle("Configuration de l'antiraid du serveur " + message.guild.name)
        .addFields({
                name: `\`\`\` AntiLink\`\`\``,
                value: `\`\`\` Status : ${data.antilink.status ? "✅" : "❌"}\`\`\``,
                inline: true
            },
            {
                name: `\`\`\` AntiSpam\`\`\``,
                value: `\`\`\` Status : ${data.antispam.status ? "✅" : "❌"}\`\`\``,
                inline: true
            },
            {
                name: '\`\`\` AntiMention\`\`\`',
                value: `\`\`\` Status : ${data.antimention.status ? "✅" : "❌"}\`\`\``,
                inline: true
            },
            {
                name: '\`\`\` AntiBadWord\`\`\`',
                value: `\`\`\` Status : ${data.antibadword.status ? "✅" : "❌"}\`\`\``,
                inline: true
            },
            {
                name: '\`\`\` AntiEmbed\`\`\`',
                value: `\`\`\` Status : ${data.antiembed.status ? "✅" : "❌"}\`\`\``,
                inline: true
            },
            {
                name: '\`\`\` AntiAdmin\`\`\`',
                value: `\`\`\` Status : ${data.antiadmin.status ? "✅" : "❌"}\`\`\``,
                inline: true
            },
            {
                name: '\`\`\` AntiScam\`\`\`',
                value: `\`\`\` Status : ${data.antiscam.status ? "✅" : "❌"}\`\`\``,
                inline: true
            },
            {
                name: '\`\`\` AntiBan\`\`\`',
                value: `\`\`\` Status : ${data.antiban.status ? "✅" : "❌"}\`\`\``,
                inline: true
            },
            {
                name: '\`\`\` AntiKick\`\`\`',
                value: `\`\`\` Status : ${data.antikick.status ? "✅" : "❌"}\`\`\``,
                inline: true
            })
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))

    const baseMenu = new StringSelectMenuBuilder()
        .setCustomId("antiraid" + message.id)
        .setMinValues(1)
        .setMaxValues(1)
        .setPlaceholder("Choisir un module")
        .addOptions({
            label: "AntiLink",
            value: "antilink"
        }, {
            label: "AntiSpam",
            value: "antispam"
        }, {
            label: "AntiMention",
            value: "antimention"
        }, {
            label: "AntiBadWord",
            value: "antibadword"
        }, {
            label: "AntiEmbed",
            value: "antiembed"
        }, {
            label: "AntiAdmin",
            value: "antiadmin"
        }, {
            label: "AntiScam",
            value: "antiscam"
        }, {
            label: "AntiBan",
            value: "antiban"
        }, {
            label: "AntiKick",
            value: "antikick"
        })

    const baseRow = new ActionRowBuilder()
        .addComponents(baseMenu)

    const basePageMenu = new StringSelectMenuBuilder()
        .setCustomId("page" + message.id)
        .setMinValues(1)
        .setMaxValues(1)
        .setPlaceholder("Choisir une page")
        .addOptions({
            label: "Page 1",
            value: "page1"
        }, {
            label: "Page 2",
            value: "page2"
        }, {
            label: "Page 3",
            value: "page3"
        })

    const baseNumButton = new ButtonBuilder()
        .setStyle(2)
        .setCustomId("pagenum" + message.id)
        .setLabel("1/3")
        .setDisabled(true)

    const basePageRow = new ActionRowBuilder()
        .addComponents(basePageMenu)

    const basePageNumRow = new ActionRowBuilder()
        .addComponents(baseNumButton)



    await msg.edit({content: null, embeds: [baseEmbed], components: [baseRow, basePageRow, basePageNumRow]})

//     collector
    const filter = (i) => i.user.id === message.author.id

    const collector = msg.createMessageComponentCollector({ filter, time: 60000 * 10 * 3 })
let settings;
    collector.on('collect', async i => {
        if (i.customId === "page" + message.id) {
            if (i.values[0] === "page1") {
                await i.update({embeds: [baseEmbed], components: [baseRow, basePageRow, basePageNumRow]})
            } else if (i.values[0] === "page2") {
                const page2Embed = new EmbedBuilder()
                    .setColor(parseInt(client.color.replace("#", ""), 16))
                    .setTimestamp(new Date())
                    .setFooter({ text: client.config.footer.text })
                    .setAuthor({name: message.author.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true })})
                    .setTitle("Configuration de l'antiraid du serveur " + message.guild.name)
                    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        {
                            name: `\`\`\` AntiBot\`\`\``,
                            value: `\`\`\` Status : ${data.antibot.status ? "✅" : "❌"}\`\`\``,
                            inline: true
                        },
                        {
                            name: `\`\`\` AntiUpdate\`\`\``,
                            value: `\`\`\` Status : ${data.antiupdate.status ? "✅" : "❌"}\`\`\``,
                            inline: true
                        },
                        {
                            name: '\`\`\` AntiRoleCreate\`\`\`',
                            value: `\`\`\` Status : ${data.antirolecreate.status ? "✅" : "❌"}\`\`\``,
                            inline: true
                        },
                        {
                            name: '\`\`\` AntiRoleDelete\`\`\`',
                            value: `\`\`\` Status : ${data.antiroledelete.status ? "✅" : "❌"}\`\`\``,
                            inline: true
                        },
                        {
                            name: '\`\`\` AntiRoleUpdate\`\`\`',
                            value: `\`\`\` Status : ${data.antiroleupdate.status ? "✅" : "❌"}\`\`\``,
                            inline: true
                        },
                        {
                            name: '\`\`\` AntiChannelCreate\`\`\`',
                            value: `\`\`\` Status : ${data.antichannelcreate.status ? "✅" : "❌"}\`\`\``,
                            inline: true
                        },
                        {
                            name: '\`\`\` AntiChannelDelete\`\`\`',
                            value: `\`\`\` Status : ${data.antichanneldelete.status ? "✅" : "❌"}\`\`\``,
                            inline: true
                        },
                        {
                            name: '\`\`\` AntiChannelUpdate\`\`\`',
                            value: `\`\`\` Status : ${data.antichannelupdate.status ? "✅" : "❌"}\`\`\``,
                            inline: true
                        },
                        {
                            name: '\`\`\` AntiInvite\`\`\`',
                            value: `\`\`\` Status : ${data.antiinvite.status ? "✅" : "❌"}\`\`\``,
                            inline: true
                        }
                    )
                const page2Menu = new StringSelectMenuBuilder()
                    .setCustomId("antiraid" + message.id)
                    .setPlaceholder("Choisir un module")
                    .addOptions(
                        {
                            label: "AntiBot",
                            value: "antibot"
                        },{
                            label: "AntiUpdate",
                            value: "antiupdate"
                        },{
                            label: "AntiRoleCreate",
                            value: "antirolecreate"
                        },{
                            label: "AntiRoleDelete",
                            value: "antiroledelete"
                        },{
                            label: "AntiRoleUpdate",
                            value: "antiroleupdate"
                        },{
                            label: "AntiChannelCreate",
                            value: "antichannelcreate"
                        },{
                            label: "AntiChannelDelete",
                            value: "antichanneldelete"
                        },{
                            label: "AntiChannelUpdate",
                            value: "antichannelupdate"
                        },{
                            label: "AntiInvite",
                            value: "antiinvite"
                        }
                    )

                const baseRow = new ActionRowBuilder()
                    .addComponents(page2Menu)
                const basePageNumRow = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("page" + message.id)
                            .setPlaceholder("Page")
                            .addOptions(
                                {
                                    label: "Page 1",
                                    value: "page1"
                                },
                                {
                                    label: "Page 2",
                                    value: "page2"
                                },
                                {
                                    label: "Page 3",
                                    value: "page3"
                                }
                            )
                    )
                const page2Row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(2)
                            .setCustomId("pagenum" + message.id)
                            .setLabel("2/3")
                            .setDisabled(true)
                    )

                await i.update({embeds: [page2Embed], components: [baseRow, basePageNumRow, page2Row]})
            } else if (i.values[0] === "page3") {
                const page3Embed = new EmbedBuilder()
                    .setColor(parseInt(client.color.replace("#", ""), 16))
                    .setTimestamp(new Date())
                    .setFooter({ text: client.config.footer.text })
                    .setAuthor({name: message.author.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true })})
                    .setTitle("Configuration de l'antiraid du serveur " + message.guild.name)
                    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        {
                            name: "\`\`\` AntiMassMention\`\`\`",
                            value: `\`\`\` Status : ${data.antimassmention.status ? "✅" : "❌"}\`\`\``,
                            inline: true
                        },
                        {
                            name: "\`\`\` AntiMassLink\`\`\`",
                            value: `\`\`\` Status : ${data.antimasslink.status ? "✅" : "❌"}\`\`\``,
                            inline: true
                        },
                        {
                            name: "\`\`\` AntiMassBan\`\`\`",
                            value: `\`\`\` Status : ${data.antimassban.status ? "✅" : "❌"}\`\`\``,
                            inline: true
                        },
                        {
                            name: "\`\`\` AntiMassKick\`\`\`",
                            value: `\`\`\` Status : ${data.antimasskick.status ? "✅" : "❌"}\`\`\``,
                            inline: true
                        }, {
                            name: "\`\`\` AntiThreadCreate\`\`\`",
                            value: `\`\`\` Status : ${data.antithreadcreate.status ? "✅" : "❌"}\`\`\``,
                            inline: true
                        }, {
                            name: "\`\`\` AntiThreadDelete\`\`\`",
                            value: `\`\`\` Status : ${data.antithreaddelete.status ? "✅" : "❌"}\`\`\``,
                            inline: true
                        }, {
                            name: "\`\`\` AntiThreadUpdate\`\`\`",
                            value: `\`\`\` Status : ${data.antithreadupdate.status ? "✅" : "❌"}\`\`\``,
                            inline: true
                        }
                    )

                const page3Menu = new StringSelectMenuBuilder()
                    .setCustomId("antiraid" + message.id)
                    .addOptions({
                        label: "AntiMassMention",
                        value: "antimassmention"
                    },{
                        label: "AntiMassLink",
                        value: "antimasslink"
                    },{
                        label: "AntiMassBan",
                        value: "antimassban"
                    },{
                        label: "AntiMassKick",
                        value: "antimasskick"
                    },{
                        label: "AntiThreadCreate",
                        value: "antithreadcreate"
                    },{
                        label: "AntiThreadDelete",
                        value: "antithreaddelete"
                    }, {
                        label: "AntiThreadUpdate",
                        value: "antithreadupdate"
                    }, {
                        label: "AntiToxicity",
                        value: "antitoxicity"
                    })


                const baseRow = new ActionRowBuilder()
                    .addComponents(page3Menu)

                const basePageRow = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("page" + message.id)
                            .setPlaceholder("Page")
                            .addOptions(
                                {
                                    label: "Page 1",
                                    value: "page1"
                                }, {
                                    label: "Page 2",
                                    value: "page2"
                                }, {
                                    label: "Page 3",
                                    value: "page3"
                                }
                            )
                    )

                const basePageNumRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(2)
                            .setCustomId("pagenum" + message.id)
                            .setLabel("3/3")
                            .setDisabled(true)
                    )
                await i.update({embeds: [page3Embed], components: [baseRow, basePageRow, basePageNumRow]})
            }
        }
        if (i.customId === "antiraid" + message.id) {
            if (i.values[0] === "antitoxicity") {
                const antitoxicityEmbed = new EmbedBuilder()
                    .setColor(parseInt(client.color.replace("#", ""), 16))
                    .setTimestamp(new Date())
                    .setFooter({ text: client.config.footer.text })
                    .setAuthor({name: message.author.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true })})
                    .setTitle("Configuration de l'antiraid du serveur " + message.guild.name)
                    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        {
                            name: "\`\`\` AntiToxicity\`\`\`",
                            value: `\`\`\` Status : ${data.antitoxicity.status ? "✅" : "❌"}\nLogs : ${data.antitoxicity.logs_enabled ? "✅" : "❌"}\nChannel Logs: ${message.guild.channel.cache.get(data.antitoxicity.logs)}\nWhitelist : ${data.antitoxicity.wl_status ? "✅" : "❌"}\nWhitelisted Users : ${data.antitoxicity.wl_users.length}\nWhitelisted Roles : ${data.antitoxicity.wl_roles.length}\`\`\``,
                            inline: true
                        }
                    )

                settings = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("antitoxicity" + message.id)
                            .addOptions({
                                label: `Status: ${data.antitoxicity.status ? "✅" : "❌"}`,
                                value: "status"
                            }, {
                                label: `Logs: ${data.antitoxicity.logs_enabled ? "✅" : "❌"}`,
                                value: "logs"
                            }, {
                                label: `Logs Channel: ${message.guild.channel.cache.get(data.antitoxicity.logs)}`,
                                value: "logschannel"
                            }, {
                                label: `Whitelist: ${data.antitoxicity.wl_status ? "✅" : "❌"}`,
                                value: "whitelist"
                            }, {
                                label: `Whitelisted Users: ${data.antitoxicity.wl_users.length}`,
                                value: "whitelistedusers"
                            }, {
                                label: `Whitelisted Roles: ${data.antitoxicity.wl_roles.length}`,
                                value: "whitelistedroles"
                            })
                    )
                await i.update({embeds: [antitoxicityEmbed], components: [settings]})
            }
        }
        if (i.customId === "antitoxicity" + message.id) {
            if (i.values[0] === "status") {
                if(data.hasOwnProperty("status")) {
                    const currentStatus = data.status;
                    const newStatus = !currentStatus;
                    data.status = newStatus
                    await client.data.set(`antiraid_${message.guild.id}`, data)
                    const antitoxicityEmbed = new EmbedBuilder()
                        .setColor(parseInt(client.color.replace("#", ""), 16))
                        .setTimestamp(new Date())
                        .setFooter({ text: client.config.footer.text })
                        .setAuthor({name: message.author.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true })})
                        .setTitle("Configuration de l'antiraid du serveur " + message.guild.name)
                        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                        .addFields(
                            {
                                name: "\`\`\` AntiToxicity\`\`\`",
                                value: `\`\`\` Status : ${data.antitoxicity.status ? "✅" : "❌"}\nLogs : ${data.antitoxicity.logs_enabled ? "✅" : "❌"}\nChannel Logs: ${message.guild.channel.cache.get(data.antitoxicity.logs)}\nWhitelist : ${data.antitoxicity.wl_status ? "✅" : "❌"}\nWhitelisted Users : ${data.antitoxicity.wl_users.length}\nWhitelisted Roles : ${data.antitoxicity.wl_roles.length}\`\`\``,
                                inline: true
                            }
                        )
                    settings = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId("antitoxicity" + message.id)
                                .addOptions({
                                    label: `Status: ${data.antitoxicity.status ? "✅" : "❌"}`,
                                    value: "status"
                                }, {
                                    label: `Logs: ${data.antitoxicity.logs_enabled ? "✅" : "❌"}`,
                                    value: "logs"
                                }, {
                                    label: `Logs Channel: ${message.guild.channel.cache.get(data.antitoxicity.logs)}`,
                                    value: "logschannel"
                                }, {
                                    label: `Whitelist: ${data.antitoxicity.wl_status ? "✅" : "❌"}`,
                                    value: "whitelist"
                                }, {
                                    label: `Whitelisted Users: ${data.antitoxicity.wl_users.length}`,
                                    value: "whitelistedusers"
                                }, {
                                    label: `Whitelisted Roles: ${data.antitoxicity.wl_roles.length}`,
                                    value: "whitelistedroles"
                                })
                        )
                    await i.update({embeds: [antitoxicityEmbed], components: [settings]})
                }

            }
            if (i.values[0] === "logs") {
                if(data.hasOwnProperty("logs")) {
                    data.logs = !data.logs
                    await client.data.set(`antitoxicity_${message.guild.id}`, data)
                    const antitoxicityEmbed = new EmbedBuilder()
                        .setColor(parseInt(client.color.replace("#", ""), 16))
                        .setTimestamp(new Date())
                        .setFooter({ text: client.config.footer.text })
                        .setAuthor({name: message.author.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true })})
                        .setTitle("Configuration de l'antiraid du serveur " + message.guild.name)
                        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                        .addFields(
                            {
                                name: "\`\`\` AntiToxicity\`\`\`",
                                value: `\`\`\` Status : ${data.antitoxicity.status ? "✅" : "❌"}\nLogs : ${data.antitoxicity.logs_enabled ? "✅" : "❌"}\nChannel Logs: ${message.guild.channel.cache.get(data.antitoxicity.logs)}\nWhitelist : ${data.antitoxicity.wl_status ? "✅" : "❌"}\nWhitelisted Users : ${data.antitoxicity.wl_users.length}\nWhitelisted Roles : ${data.antitoxicity.wl_roles.length}\`\`\``,
                                inline: true
                            }
                        )
                    // select menu to select the channel of the logs
                }


            }
        }
    })

}
