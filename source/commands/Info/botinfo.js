const Discord = require("discord.js")
const {EmbedBuilder} = require("discord.js")
const devN = [];
module.exports = {
    name: "botinfo",
   category: "💻〢Informations",
    aliases: ["botinfo"],
    run: async (client, message, args) => {
        let botOwner;
        let msg = await message.channel.send({content: "récupération des informations en cours . . ."})
   
        await update(client, message , msg)
    }
}

async function update(client, message , msg) {
    await getDevs(client, client.config.devs)
    let color = parseInt(client.color.replace("#", ""), 16);
    let totalSeconds = (client.uptime / 1000);
    let jours = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let heures = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let secondes = Math.floor(totalSeconds % 60);
            msg.edit({
                content: null,
                embeds: [new EmbedBuilder({
                    title: client.user.username + " " + "Bot info",
                    image: {url: ""},
                    color: color,
                    footer: client.config.footer,
                    timestamp: new Date(),
                    fields: [
                        {name: "Nom du bot", value: client.user.username, inline: true},
                        {name: "Status du bot", value: `${client.presence.status}`, inline: true},
                        {name: "Activité du bot", value: `${client.presence.activities[0].name}`, inline: true},
                        {name: "ID du bot", value: `**${client.user.id}**`, inline: true},
                        {name: "Tag du bot", value: `**${client.user.tag}**`, inline: true},
                        {name: "Propriétaire du bot", value: `${client.users.cache.get(client.config.buyer).username}`, inline: true},
                        {name: "Version du bot", value: `**${client.version.version}**`, inline: true},
                        {name: "Serveurs", value: `**${client.guilds.cache.size}** serveur(s)`, inline: true},
                        {name: "Utilisateurs", value: `**${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0).toLocaleString()}** utilisateur(s)`, inline: true},
                        {name: "Channels", value: `**${client.channels.cache.size}** channel(s)`, inline: true},
                        {name: "Connecté depuis", value: `${jours} jours, ${heures} heures, ${minutes} minutes et ${secondes} secondes`, inline: true},
                        {name: "Commandes", value: `**${client.commands.size}** commandes`, inline: true},
                        {name: "RAM", value: `**${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB**`, inline: true},
                        {name: "Discord.js", value: `**${Discord.version}**`, inline: true},
                        {name: "Node.js", value: `**${process.version}**`, inline: true},
                        {name: "OS", value: process.platform, inline: true},
                        {name: "Arch", value: process.arch, inline: true},
                        {name: "Dev", value: devN.join(', '), inline: true},
                    ],
                    image: {
                        url: client.user.avatarURL({dynamic: true})
                    }
                })
            ]
        })
}

async function getDevs (client, ids) {
    for (const id of ids) {
        try {
            const dev = await client.users.fetch(id)
            devN.push(dev.username)
        } catch(e) {
            console.error(e)
        }
    }
}