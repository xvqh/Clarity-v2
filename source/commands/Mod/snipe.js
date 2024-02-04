const Discord = require("discord.js")
const links = [
    'discord.gg',
    'dsc.bio',
    'www',
    'https',
    'http',
    '.ga',
    '.fr',
    '.com',
    '.tk',
    '.ml',
    '://',
    '.gg'
]
module.exports = {
    name: "snipe",
  category: "📝〢Moderation",
    run: async(client, message) => {
        let isLinkall = false
        let color = parseInt(client.color.replace("#", ""), 16);
        const msg = client.snipes.get(message.channel.id)
        if (!msg) return message.channel.send("Aucun message n'a été supprimer récemment !")

        links.forEach(l => {
            if (msg.content.includes(l)) {
                isLinkall = true
            }
        })
        if (isLinkall == true) {
            const embedl = new Discord.EmbedBuilder()
                .setDescription(`**${msg.author.tag}** \`\`\`discord.gg/******\`\`\``)
                .setFooter(client.config.footer)
                .setColor(color)
            return message.channel.send({ embeds: [embedl] })
        }
        const embed = new Discord.EmbedBuilder()
        .setDescription(`**${msg.author.tag}** \`\`\`${msg.content}\`\`\``)
        .setColor(color)
        .setFooter(client.config.footer)
    if (msg.image) embed.setImage(msg.image)

    message.channel.send({ embeds: [embed] })
    }
}