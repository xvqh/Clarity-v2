const Discord = require("discord.js");
const { Clarity } = require('../../structures/client/index');

module.exports = {
  name: "autocolor",
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
      CREATE TABLE IF NOT EXISTS clarity_${client.user.id}_${message.guild.id} (
        prefix TEXT,
        color TEXT
      )
    `)
    let auto = parseInt(client.config.default_color.replace("#",""), 16)
    await client.db.none(
      `UPDATE clarity_${client.user.id}_${message.guild.id} SET color = $1`,
      [auto]
    ).then(() => {
      console.log("[DB] Update");
      message.reply({ content: `La couleur a été mise à jour : \`${client.config.default_color}\`` });
    }).catch(error => {
      console.log("Erreur lors de la mise à jour de la DB : " + error);
      message.reply({ content: 'Une erreur s\'est produite lors de la mise à jour de la couleur.' });
    });
        
    
}
  }

