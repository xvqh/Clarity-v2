import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, Client, Message, Component, ComponentType, BaseSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType } from "discord.js";

export default {
    name: "antitoxicity",
    category: "Anti-raid",
    run: async (client: Client, message: Message) => {

        if (client.config.devs.includes(message.author.id)) {
            let msg = await message.channel.send({ content: "Chargement du module en cours . . . " })
            await update(client, msg, message)
        } else {
            const isOwn = await client.db.oneOrNone(
                `SELECT 1 FROM clarity_${client.user?.id}_${message.guildId}_owners WHERE user_id = $1`,
                [message.author.id]
            );
            if (!isOwn) {
                return message.reply({
                    content: "Vous n'avez pas la permission d'utiliser cette commande",
                });
            }
            let msg = await message.channel.send({ content: "Chargement du module en cours . . . " })
            await update(client, msg, message)
        }
    }
}

async function update(client: Client, msg: Message, message: Message) {

    let data = client.data.get(`antitoxicity_${message.guild?.id}`) || {
        status: false,
        logs: null,
        logs_enabled: false,
        wl_status: false,
        wl_users: [],
        wl_roles: []
    }

    const antitoxicityEmbed = new EmbedBuilder()
        .setColor(parseInt(client.color.replace("#", ""), 16))
        .setTimestamp(new Date())
        .setFooter({ text: client.config.footer.text })
        .setAuthor({ name: message.author.displayName, iconURL: message.author.displayAvatarURL({ forceStatic: false }) })
        .setTitle("Configuration du systeme antitoxicite " + message.guild?.name)
        .setThumbnail(client.user?.displayAvatarURL({ forceStatic: false }) as string)
        .addFields(
            {
                name: "\`\`\` AntiToxicity\`\`\`",
                value: `\`\`\`Status : ${data.status ? "✅" : "❌"}\nLogs : ${data.logs_enabled ? "✅" : "❌"}\nChannel Logs: ${message.guild?.channels.cache.get(data.logs) ? message.guild.channels.cache.get(data.logs) : 'Non configurer'}\nWhitelist : ${data.wl_status ? "✅" : "❌"}\nWhitelisted Users : ${data.wl_users.length ? data.wl_users.length : 'Aucun'}\nWhitelisted Roles : ${data.wl_roles.length ? data.wl_roles.length : 'Aucun'}\`\`\``,
                inline: true
            }
        )

    const settings = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("antitoxicity" + message.id)
                .addOptions({
                    label: `Status: ${data.status ? "✅" : "❌"}`,
                    value: "status"
                }, {
                    label: `Logs: ${data.logs_enabled ? "✅" : "❌"}`,
                    value: "logs"
                }, {
                    label: `Logs Channel: ${message.guild?.channels.cache.get(data.logs) ? message.guild.channels.cache.get(data.logs) : 'Non configurer'}`,
                    value: "logschannel"
                }, {
                    label: `Whitelist: ${data.wl_status ? "✅" : "❌"}`,
                    value: "whitelist"
                }, {
                    label: `Whitelisted Users: ${data.wl_users.length ? data.wl_users.length : 'Aucun'}`,
                    value: "whitelistedusers"
                }, {
                    label: `Whitelisted Roles: ${data.wl_roles.length ? data.wl_roles.length : 'Aucun'}`,
                    value: "whitelistedroles"
                })
        )

    await msg.edit({ embeds: [antitoxicityEmbed], components: [settings] })

    const collector = message.channel.createMessageComponentCollector({
        filter: (i) => i.user.id === message.author.id,
        time: 60_000,
        componentType: ComponentType.StringSelect
    });

    collector.on("collect", async i => {

        if (i.customId === "antitoxicity" + message.id) {

            if (i.values[0] === "status") {
                if (data.hasOwnProperty('status')) {
                    data.status = !data.status
                    const currentStatus = data.status;
                    const newStatus = !currentStatus;
                    data.status = newStatus
                    await client.data.set(`antiraid_${message.guild?.id}`, data)
                    await msg.edit({ embeds: [antitoxicityEmbed], components: [settings] })
                }
            } else if (i.values[0] === "logs") {

                if (data.hasOwnProperty('logs_enabled')) {
                    data.logs_enabled = !data.logs_enabled
                    const currentStatus = data.logs_enabled;
                    const newStatus = !currentStatus;
                    data.logs_enabled = newStatus
                    await client.data.set(`antitoxicity_${message.guild?.id}`, data)
                    await msg.edit({ embeds: [antitoxicityEmbed], components: [settings] })
                }
            } else if (i.values[0] === "logschannel") {


                msg.edit({
                    components: [{
                        type: 1,
                        components: [
                            {
                                custom_id: 'logsc' + message.id,
                                type: 8,
                                placeholder: 'Logs',
                            },
                        ]
                    }]
                })
            } else if (i.values[0] === "whitelist") {

                if (data.hasOwnProperty('wl_status')) {
                    data.wl_status = !data.wl_status
                    const currentStatus = data.wl_status;
                    const newStatus = !currentStatus;
                    data.wl_status = newStatus
                    await client.data.set(`antitoxicity_${message.guild?.id}`, data)
                    await msg.edit({ embeds: [antitoxicityEmbed], components: [settings] })
                }
            } else if (i.values[0] === "whitelistedusers") {

                msg.edit({
                    components: [{
                        type: 1,
                        components: [{
                            custom_id: 'wlusersc' + message.id,
                            type: 5,
                            placeholder: 'Whitelisted Users',
                            // value: 'Whitelisted Users'
                        }]
                    }]
                })
            } else if (i.values[0] === "whitelistedroles") {

                msg.edit({
                    components: [{
                        type: 1,
                        components: [{
                            custom_id: 'wlrolesc' + message.id,
                            type: 5,
                            placeholder: 'Whitelisted Roles',
                            // value: 'Whitelisted Roles'
                        }]
                    }]
                })
            }
        }
    })

    client.on('interactionCreate', async (i) => {

        if (!i.isChannelSelectMenu()) return;

        if (i.customId === 'logsc' + message.id) {
            if (i.values[0] === 'Logs') {
                let data = client.data.get(`antitoxicity_${message.guild?.id}`) || {
                    status: false,
                    logs: null,
                    logs_enabled: false,
                    wl_status: false,
                    wl_users: [],
                    wl_roles: []
                }
                const channel = i.values[0];
                if (data.hasOwnProperty('logs')) {
                    data.logs = channel
                    await client.data.set(`antitoxicity_${message.guild?.id}`, data)
                    await msg.edit({ embeds: [antitoxicityEmbed], components: [settings] })
                }
            }
        } else if (i.customId === 'wlusersc' + message.id) {
            if (i.values[0] === 'Whitelisted Users') {
                let data = client.data.get(`antitoxicity_${message.guild?.id}`) || {
                    status: false,
                    logs: null,
                    logs_enabled: false,
                    wl_status: false,
                    wl_users: [],
                    wl_roles: []
                }
                const user = i.values[0];
                if (data.hasOwnProperty('wl_users')) {
                    data.wl_users = user
                    await client.data.set(`antitoxicity_${message.guild?.id}`, data)
                    await msg.edit({ embeds: [antitoxicityEmbed], components: [settings] })
                }
            }
        } else if (i.customId === 'wlrolesc' + message.id) {
            if (i.values[0] === 'Whitelisted Roles') {
                let data = client.data.get(`antitoxicity_${message.guild?.id}`) || {
                    status: false,
                    logs: null,
                    logs_enabled: false,
                    wl_status: false,
                    wl_users: [],
                    wl_roles: []
                }
                const role = i.values[0];
                if (data.hasOwnProperty('wl_roles')) {
                    data.wl_roles = role
                    await client.data.set(`antitoxicity_${message.guild?.id}`, data)
                    await msg.edit({ embeds: [antitoxicityEmbed], components: [settings] })
                }
            }
        }
    })



}
