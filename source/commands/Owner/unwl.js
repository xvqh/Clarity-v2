const Discord = require("discord.js");
const { Clarity } = require("../../structures/client/index");

module.exports = {
  name: "unwl",
  aliases: ["unwhitelist"],
category: "⚙️〢Owner",
  /**
   * @param {Clarity} client
   */
  run: async (client, message, args) => {
    const isOwn = await client.db.oneOrNone(
      `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
      [message.author.id]
    );;
    if (!isOwn) {
      return message.reply({
        content: "Vous n'avez pas la permission d'utiliser cette commande",
      });
    }
    await client.db.none(`
      CREATE TABLE IF NOT EXISTS clarity_${client.user.id}_${message.guild.id}_wl (
        user_id VARCHAR(20) PRIMARY KEY
      )`);
    let color = parseInt(client.color.replace("#", ""), 16);
    const user = message.mentions.members.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(()=> {})
    
    if (!user) {
      return message.reply({ content: "Veuillez mentionner un utilisateur à retirer de la liste blanche." });
    }

    const isBlacked = await client.db.oneOrNone(
      `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_wl WHERE user_id = $1`,
      [user.id]
    );

    if (!isBlacked) {
      return message.reply({ content: `${user} n'est pas dans la liste blanche.` });
    }

    await client.db
      .none(
        `
        DELETE FROM clarity_${client.user.id}_${message.guild.id}_wl WHERE user_id = $1
        `,
        [user.id]
      )
      .then(message.reply({ content: `${user} a été retiré de la liste blanche.` }))
      .catch((error) => {
        console.log("Erreur lors de la mise à jour de la DB : " + error);
        message.reply({
          content: "Une erreur s'est produite lors de la suppression de l'utilisateur de la liste blanche",
        });
      });
  },
};
