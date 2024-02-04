module.exports = {
    name: "ticket",
   category: "🔨〢Gestion",
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
          await client.db.oneOrNone(` CREATE TABLE IF NOT EXISTS clarity_${message.guild.id}_ticket (
            role_id VARCHAR(20),
            type TEXT,
            name TEXT
        )`)
        let msg  = await message.channel.send({
            content: "Module en cours de chargement . . . "
        })
        await update(client, message, msg)
    }
}

async function update(client, message, msg) {
  msg.edit({
      content: null,
      embeds: [{
          title: client.user.username + " " + "Ticket Panel",
          color: parseInt(client.color.replace("#", ""), 16),
          footer: client.config.footer,
          timestamp: new Date(),
          fields: [
              {name: "Nom ", value: client.user.username},
              {name: "Status du bot", value: `${client.presence.status}`},
              {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
          ],
                    image: {
                          url: client.user.avatarURL({dynamic: true})
                   }
      }],
      //     components: [{
      //         type: 1,
      //         components: [{
      //             type: 3,
  })
}