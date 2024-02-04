const Discord = require("discord.js")
const { EmbedBuilder, StringSelectMenuBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js")
const ms = require("ms")
module.exports = {
    name: "ticket",
    aliases: ["tickets"],
    run: async(client, message, args) => {
        let msg = await message.channel.send({ content: "Chargement en cours du module. . . " });
        await update(client, message, msg);
    }
}

async function update(client, message, msg) {
    // init the ticket system for the server with the db
    const db = client.data2.get(`ticket_${message.guild.id}`) || {
        tickets: [
            {
                panelName: null,
                panelID: null,
                ticketCategory: null,
                ticketChannel: null,
                logs: null,
                type: "text",
                access: [
                    {
                        users: [],
                        roles: []
                    }
                ],
                modrole: [],
                claim: false,
                leaveclose: false,
                close: false,
                reopen: false,
                delete: false,
                transcriptMP: false,
                module: "boutton",
                text: [
                    {
                        embeds: [
                            {
                                title: null,
                                description: null,
                                color: null,
                                thumbnail: null,
                                image: null,
                                footer: null,
                                timestamp: null,
                                author: null,
                                fields: null
                            }
                        ],
                        content: null
                    }
                ],
                options: [],
                maxticket: null
            }
        ]
    }
    const data = db.tickets;
    // new embed for the panel config of the ticket
    const embed = new EmbedBuilder()
        .setTitle("Configuration du ticket")
        .setDescription("Cliquez sur le bouton ci-dessous pour configurer votre ticket.")
        .setColor(client.color)
        .setTimestamp()
        .setFooter(client.config.footer)
    // new button for the panel config of the ticket
    const button = new ButtonBuilder()
        .setLabel("New ticket panel")
        .setStyle("Primary")
        .setCustomId("configure_ticket" + message.id);

    const row = new ActionRowBuilder()
        .addComponents(button)

    msg.edit({ content: null, embeds: [embed], components: [row] })

    const filter = i => i.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({ filter });

    let optionselector = [];
    if (db && Array.isArray(db.options)) {
        optionselector = db.options.map(options => ({
            label: options.text,
            description: options.description || "Aucune",
            value: options.value
        }));
    }
    collector.on("collect", async i => {
        if (i.customId === "configure_ticket" + message.id) {
            i.deferUpdate();

            msg.edit({ embeds: [{
                title: "Configuration du ticket",
                    description: "Utilisez le menu pour configurer le panel ticket",
                    fields: [{
                        name: "Nom Du Panel",
                        value: `${data.panelName ? data.panelName : "Non configuré"}`,
                        inline: true
                    }, {
                    name: "ID Du Panel",
                        value: `${data.panelID? data.panelID : "Non configuré"}`,
                        inline: true
                    }, {
                    name: "Catégorie du Panel",
                        value: `${data.ticketCategory? data.ticketCategory : "Non configuré"}`,
                        inline: true
                    }, {
                    name: "Channel du Panel",
                        value: `${data.ticketChannel? data.ticketChannel : "Non configuré"}`,
                        inline: true
                    }, {
                    name: "Logs du Panel",
                        value: `${data.logs? data.logs : "Non configuré"}`,
                        inline: true
                    }, {
                    name: "Type du Panel",
                        value: `${data.module? data.module : "Non configuré"}`,
                        inline: true
                    }],
                    color: parseInt(client.color.replace("#", ""), 16),
                    timestamp: new Date(),
                    footer: {
                        text: client.config.footer.text,
                        icon_url: client.user.displayAvatarURL({ dynamic: true })
                    }
                }], components : [{type: 1, components : [{
                    type: 3,
                    custom_id: "ticketconfig" + message.id,
                    options: [{
                        label: "Nom du Panel",
                        value: "panelName"
                    }, {
                    label: "ID du Panel",
                        value: "panelID"
                    }, {
                    label: "Catégorie du Panel",
                        value: "ticketCategory"
                    }, {
                    label: "Channel du Panel",
                        value: "ticketChannel"
                    }, {
                    label: "Logs du Panel",
                        value: "logs"
                    }, {
                    label: "Type du Panel",
                        value: "module"
                    }, {
                    label: "Confirmation du Panel",
                        value: "confirm"
                    }]
                    }, {
                    type: 3,
                        custom_id: "optionsconfig" + message.id,
                        options: [...optionselector, {
                            label: 'Ajouter une option...',
                            emoji: "➕",
                            value: 'addoption'
                        }]
                    }]}] })
        }
    })

}