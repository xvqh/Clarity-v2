
const { EmbedBuilder } = require("discord.js");
const { Clarity } = require("../../structures/client")

module.exports = {
  name: "restart",
  aliases: [],
  description: "Permet de redémarrer le bot",
  category: "🛠️〢Buyer",
  /**
  * @param {Clarity} client
  */
  run: async (client, message, args) => {
    const isOwn = await client.db.oneOrNone(
      `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = \$1`,
      [message.author.id]
    );
    if (!isOwn) {
      return message.reply({
        content: "Vous n'avez pas la permission d'utiliser cette commande",
      });
    }
    let msg = await message.channel.send({ content: "Redémarrage en cours..." });
    client.destroy();
    new Clarity();
    return msg.channel.send("Redémarrage terminé avec succès");
  },
};

