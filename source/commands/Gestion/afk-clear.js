module.exports = {
    name: "afk-clear",
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
          const afkUsers = await client.db.any(`
          SELECT * FROM clarity_afk
        `);
        if (!afkUsers.length) {
          return message.channel.send("Aucun utilisateur AFK.");
        }
        await client.db.none(
          `DELETE FROM clarity_afk`
        )
        message.channel.send("Les utilisateurs AFK ont bien été supprimés.");
        }
}