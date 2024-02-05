import Discord from "discord.js";

export default {
    name: "warns",
    description: "recuperer les warns d 'un user",
    aliases: [],
    category: "📝〢Moderation",
    run: async (client, message, args) => {
        let color = parseInt(client.color.replace('#', ''), 16);
        const user = message.mentions.members.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => { })
        if (!user) return message.reply({ content: "Veuillez préciser l'utilisateur dont vous souhaitez voir les warns" })
        const warns = await client.db.any(`SELECT * FROM clarity_${client.user.id}_${message.guild.id}_warns WHERE user_id = $1`, [user.id])
        if (warns.length > 0) {
            const warnsP = await Promise.all(warns.map(async (warn) => {
                const user = await client.users.fetch(warn.user_id);
                const author = await client.users.fetch(warn.author_id);
                const userTag = user.tag;
                const authorTag = author.tag
                const userLink = `https://discord.com/users/${warn.user_id}`;
                const warnDetails = `[Warn ID: ${warn.warn_id}](https://discord.com/guilds/${message.guild.id})\n[Raison: ${warn.reason}](https://discord.com/guilds/${message.guild.id})`;
                const authorDetails = `[Auteur: ${authorTag}](https://discord.com/users/${warn.author_id})`;

                return `[Utilisateur: ${userTag}](${userLink})\n${warnDetails}\n${authorDetails}`;
            }))
            const warnsD = warnsP.join('\n')
            const embed = new Discord.EmbedBuilder()
                .setColor(color)
                .setTitle(message.guild.name + " - " + "Liste des warns de" + " " + user.username)
                .setDescription(warnsD)
                .setFooter(client.config.footer)
            return message.reply({ embeds: [embed] })
        } else {
            return message.reply({ content: user.username + " n'a pas de warns" })
        }
    }
}