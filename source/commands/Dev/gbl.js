export default {
  name: "gbl",
  category: "🔗〢Dev",
  run: async (client, message, args) => {
    let color = parseInt(client.color.replace('#', ''), 16);
    if (!client.config.devs.includes(message.author.id)) return message.reply({
      content: "Vous n'avez pas la permission pour faire cette commande"
    })
    if (client.config.devs.includes(message.author.id)) {
      await client.db.none(`
            CREATE TABLE IF NOT EXISTS clarity_gblacklist (
                user_id VARCHAR(20) PRIMARY KEY
            )`)
      const user = message.mentions.members.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => { })
      if (!user) {
        const gblacklist = await client.db.any(
          `SELECT user_id FROM clarity_gblacklist`
        );
        if (gblacklist.length === 0) return message.reply({ content: "Aucun gBlacklist" })
        const gblTag = await Promise.all(gblacklist.map((async (gbl) => `[${(await client.users.fetch(gbl.user_id)).tag}](https://discord.com/users/${gbl.user_id})`)))
        return message.reply({
          embeds: [{
            title: "ζ͜͡Clarity - GBL",
            description: gblTag.join('\n'),
            color: color,
            footer: client.config.footer
          }]
        })
      }
      const dev = client.config.devs;
      if (user.id === message.author.id) {
        return message.reply({ content: `${user} vous ne pouvez pas vous auto gbl.` });
      }
      if (user.id === dev) {
        return message.reply({ content: `${user} est un dev du bot et ne peut pas être gbl.` });
      }
      const isAlreadygbl = await client.db.oneOrNone(
        `
            SELECT 1 FROM clarity_gblacklist WHERE user_id = $1
            `,
        [user.id]
      );
      if (isAlreadygbl) {
        return message.reply({ content: `${user} est déja gblacklist` });
      }
      await client.db
        .none(
          `
          INSERT INTO clarity_gblacklist (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING
          `,
          [user.id]
        )
        .then(message.reply({ content: `${user} est maintenant gblacklist` }))
        .catch((error) => {
          console.log(error)
          console.log("Erreur lors de la mise à jour de la DB : " + error);
          message.reply({
            content: "Une erreur s'est produite lors de l'ajout a la gblacklist.",
          });
        });
      client.guilds.cache.forEach(async g => {
        g.members.ban(user.id, { days: 7, reason: `gblacklisted by ${message.author.username}` })
      })
    }
  }
}