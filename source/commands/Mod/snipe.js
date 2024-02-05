import Discord from "discord.js";

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
export default {
    name: "snipe",
    category: "📝〢Moderation",
    run: async (client, message) => {
        let isLinkall = false
        let color = parseInt(client.color.replace('#', ''), 16);
        const msg = client.snipes.get(message.channel.id)
        if (!msg) return message.channel.send("Aucun message n'a été supprimer récemment !")

        let snipeD = client.snipes.get(message.channel.id)
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

        if (snipeD.embeds.length > 0) {
            const oldEmbed = snipeD.embeds[0];
            if (oldEmbed.title) embed.addFields({ name: 'Titre', value: oldEmbed.title });
            if (oldEmbed.description) embed.addFields({ name: 'Description', value: oldEmbed.description });
            if (oldEmbed.fields.length > 0) {
                oldEmbed.fields.forEach(field => {
                    embed.addFields({ name: field.name, value: field.value, inline: field.inline });
                });
            }
            if (oldEmbed.thumbnail) embed.setThumbnail(oldEmbed.thumbnail.url);
            if (oldEmbed.image) embed.setImage(oldEmbed.image.url);
        }

        message.channel.send({ embeds: [embed] })

    }
}