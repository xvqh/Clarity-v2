const Discord = require("discord.js");
const { Clarity } = require("../../structures/client/index");
module.exports = {
  name: "blacklist",
  aliases: ["bl"],
category: "⚙️〢Owner",
  /**
   * @param {Clarity} client
   */
  run: async (client, message, args) => {
    const isOwn = await client.db.oneOrNone(
      `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
      [message.author.id]
    );
    if (!isOwn) {
      return message.reply({
        content: "Vous n'avez pas la permission d'utiliser cette commande",
      });
    }
    await client.db.none(`
    CREATE TABLE IF NOT EXISTS clarity_${client.user.id}_${message.guild.id}_blacklist (
        user_id VARCHAR(20) PRIMARY KEY
    )`);
    let color = parseInt(client.color.replace("#", ""), 16);
    const user = message.mentions.members.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(()=> {})
    if (!user) {
      const blacklist = await client.db.any(
        `SELECT user_id FROM clarity_${client.user.id}_${message.guild.id}_blacklist`
      );
      
      if (blacklist.length === 0)
        return message.reply({ content: "Aucun blacklist" });
      const blTag = await Promise.all(blacklist.map(async (blacklist) => `[${(await client.users.fetch(blacklist.user_id)).tag}](https://discord.com/users/${blacklist.user_id})` ))
     return message.reply({ embeds: [{
      description: blTag.join('\n'),
      color: color,
      footer: client.config.footer
     }] });
    }
    const buyerID = client.config.buyer; 

    if (user.id === message.author.id) {
      return message.reply({ content: `${user} vous ne pouvez pas vous auto bl.` });
    }
if (user.id === buyerID) {
  return message.reply({ content: `${user} est le propriétaire du bot et ne peut pas être bl.` });
}
  
    const isAlreadybl = await client.db.oneOrNone(
      `
      SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_blacklist WHERE user_id = $1
      `,
      [user.id]
    );
    if (isAlreadybl) {
      return message.reply({ content: `${user} est déja blacklist` });
    }
    await client.db
      .none(
        `
      INSERT INTO clarity_${client.user.id}_${message.guild.id}_blacklist (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING
      `,
        [user.id]
      )
      .then(message.reply({ content: `${user} est maintenant blacklist` }))
      .catch((error) => {
        console.log(error)
        console.log("Erreur lors de la mise à jour de la DB : " + error);
        message.reply({
          content: "Une erreur s'est produite lors de l'ajout a la blacklist.",
        });
      });
      message.guild.members.ban(user.id, {reason: `blacklisted by ${message.author.username}`}).catch(()=> {})
  },
};

