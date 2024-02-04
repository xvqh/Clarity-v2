const {EmbedBuilder} = require("discord.js")
module.exports = {
    name: "test",
  category: "🔗〢Dev",
    run : async(client, message, args) => {
        if (!client.config.devs.includes(message.author.id)) {
            return message.reply({content: "Et bah non on respecte les T.O.S de discord nous !!!"})
        }
        let user = message.mentions.users.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => null);
        if (!user) {
            user = message.author;
        }
        // recup la db prevname de l user
        let prevname = await client.db.any(`
            SELECT * FROM clarity_${user.id}_prevname
            ORDER BY date DESC
        `)
        if (prevname.length === 0) {
            return message.reply({content: "Il n'y a pas de prevname enregistrer"})
        }

        let color = parseInt(client.color.replace('#', ''), 16);
        message.channel.send({
            embeds: [new EmbedBuilder({
                title: user.username + " - " + "Liste des prevnames",
                description: prevname.map(prevname => `${prevname.prevname} - <t:${Math.floor(prevname.date / 1000)}:d>`).join("\n"),
                color: color,
                footer: client.config.footer,
                timestamp: new Date(),
            })]
        })
    }
}