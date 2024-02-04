const {EmbedBuilder} = require("discord.js")
module.exports = {
    name: "recup",
    description: "Génère un code de recup",
  category: "🛠️〢Buyer",
    run: async(client, message, args) => {
        const isBuy = await client.functions.isBuy(client, message.author.id);
        if (!isBuy) {
          return message.reply({
            content: "Vous n'avez pas la permission d'utiliser cette commande",
          });
        }
        // recupere la guild grace a son id qu on donne avec notre message
        const guildId = args[0]
        const guild = client.guilds.cache.get(guildId)
        if (!guild) {
            return message.reply({
                content: "Serveur non trouver"
            })
        }
   guild.leave();
   message.reply({
       embeds: [new EmbedBuilder({
           description: `Le serveur ${guild.name} a été quitté avec succès`,
           color: parseInt(client.color.replace("#", ""), 16),
           footer: client.config.footer,
           timestamp: new Date()
       })],
   })
       }
   }

