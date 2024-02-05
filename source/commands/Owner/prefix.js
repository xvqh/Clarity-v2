import Clarity from "../../structures/client/index.js";

export default {
  name: "prefix",
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
    const prefix = args[0];
    if (!prefix) return message.reply({ content: "Précise le préfixe" });
    await client.db.none(`
      CREATE TABLE IF NOT EXISTS clarity_${client.user.id}_${message.guild.id} (
        prefix TEXT
      )
    `);
    if (prefix) {
      const result = await client.db.oneOrNone(
        `SELECT prefix FROM clarity_${client.user.id}_${message.guild.id}`
      );

      if (result) {
        await client.db.none(
          `UPDATE clarity_${client.user.id}_${message.guild.id} SET prefix = $1`,
          [prefix]
        ).then(() => {
          console.log("[DB] Update");
          message.reply({ content: `Le préfix a été mis à jour : \`${prefix}\`` });
        }).catch(error => {
          console.log("Erreur lors de la mise à jour de la DB : " + error);
          message.reply({ content: 'Une erreur s\'est produite lors de la mise à jour du préfix.' });
        });
      } else {
        await client.db.none(
          `INSERT INTO clarity_${client.user.id}_${message.guild.id} (prefix) VALUES ($1)`,
          [prefix]
        ).then(() => {
          console.log("[DB] Update");
          message.reply({ content: `Le préfix a été mis à jour: \`${prefix}\`` });
        }).catch(error => {
          console.log("Erreur lors de l'insertion dans la DB : " + error);
          message.reply({ content: 'Une erreur s\'est produite lors de la mise à jour du préfix.' });
        });

      }
    }
  }
}

