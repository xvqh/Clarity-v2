module.exports = {
    name: "afk-list",
    description: "Affiche la liste des utilisateurs AFK.",
   category: "🤖〢Bot",
    run: async (client, message, args) => {
        const afkUsers = await client.db.any(`
        SELECT * FROM clarity_afk
      `);
      if (!afkUsers.length) {
        return message.channel.send("Aucun utilisateur AFK.");
      }
   
      message.channel.send({ embeds: [{
        title: `AFK - SYSTEM`,
        fields: afkUsers.map((user) => ({
          name: `${client.users.cache.get(user.user_id).username}`,
          value: "Raison:" + " " + user.raison
        })),
        color: parseInt(client.color.replace("#", ""), 16),
        footer: client.config.footer
      }] });
    }
}