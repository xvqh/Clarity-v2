const { Client, Message } = require("discord.js");

/**
 * @param {Client} client
 * @param {Message} message
 * @param {string[]} args
 */
module.exports = {
  name: "afk",
  description: "AFK",
 category: "🤖〢Bot",
  run: async (client, message, args) => {
    try {
      await client.db.none(`
        CREATE TABLE IF NOT EXISTS clarity_afk (
          user_id VARCHAR(20) PRIMARY KEY,
          raison TEXT
        )
      `);
      const raison = args.join(" ");
      await client.db.none(
        `INSERT INTO clarity_afk (user_id, raison) VALUES (\$1, \$2)`,
        [message.author.id, raison]
      );
      message.channel.send({
        embeds: [{
          title: `AFK - SYSTEM`,
          description: `Vous êtes maintenant AFK. Les autres utilisateurs seront informés de votre statut lorsque vous serez mentionné.`,
          fields: [{
            name: "Raison",
            value: raison
          }],
          image: {
            url: message.author.avatarURL({dynamic: true})
          }, 
          color: parseInt(client.color.replace("#", ""), 16),
          footer: client.config.footer
        }]
      });
    } catch (error) {
      console.error(error);
    }
}
};
