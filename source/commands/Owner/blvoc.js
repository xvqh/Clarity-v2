const Discord = require("discord.js");
const { Clarity } = require("../../structures/client/index");

module.exports = {
  name: "blvoc",
  aliases: ["blacklistvoc"],
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
      CREATE TABLE IF NOT EXISTS clarity_${client.user.id}_${message.guild.id}_blvoc (
        user_id VARCHAR(20) PRIMARY KEY
      )`);
    let color = parseInt(client.color.replace("#", ""), 16);
    const user = message.mentions.members.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(()=> {})
    
    if (!user) {
      return message.reply({ content: "Veuillez mentionner un utilisateur à retirer de la liste des interdits vocal." });
    }

    const isAlreadybl = await client.db.oneOrNone(
        `
        SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_blvoc WHERE user_id = $1
        `,
        [user.id]
      );
      if (isAlreadybl) {
        return message.reply({ content: `${user} est déja dans la liste des interdits vocal` });
      }

    await client.db
      .none(
        `
        INSERT INTO clarity_${client.user.id}_${message.guild.id}_blvoc (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING
        `,
        [user.id]
      )
      .then(message.reply({ content: `${user} a été ajouté à la liste des interdits vocal.` }))
      .catch((error) => {
        console.log("Erreur lors de la mise à jour de la DB : " + error);
        message.reply({
          content: "Une erreur s'est produite lors de l ajout de l'utilisateur à la liste des interdits vocal.",
        });
      });
  },
};
