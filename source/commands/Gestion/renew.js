const Discord = require("discord.js");
const { Clarity } = require("../../structures/client/index");

module.exports = {
  name: "renew",
  description: "Renouveler un salon",
 category: "🔨〢Gestion",
  /**
   * @param {Clarity} client
   */
  run: async (client, message, args) => {
    
    const isBuy = await client.functions.isBuy(client, message.author.id);

    if (!isBuy) {
      return message.reply({
        content: "Vous n'avez pas la permission d'utiliser cette commande.",
      });
    }
    const isOwn = await client.db.oneOrNone(
      `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
      [message.author.id]
    );

    if (!isOwn) {
      return message.reply({
        content: "Vous n'avez pas la permission d'utiliser cette commande.",
      });
    }
   
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel
        if (channel === message.channel) {
            try {
                let ee = await channel.clone({
                  name: channel.name,
                  permissions: channel.permissionsOverwrites,
                  type: channel.type,
                  topic: channel.withTopic,
                  nsfw: channel.nsfw,
                  birate: channel.bitrate,
                  userLimit: channel.userLimit,
                  rateLimitPerUser: channel.rateLimitPerUser,
                  permissions: channel.withPermissions,
                  position: channel.rawPosition,
                  reason:  `Salon recréé par ${message.author.tag} (${message.author.id})`
                })
                channel.delete()
                ee.send({ content: `${message.author} salon recréé` })
            } catch(error) {
                console.log(error)
            }
        } else {
            try {
                let ee = await channel.clone({
                  name: channel.name,
                  permissions: channel.permissionsOverwrites,
                  type: channel.type,
                  topic: channel.withTopic,
                  nsfw: channel.nsfw,
                  birate: channel.bitrate,
                  userLimit: channel.userLimit,
                  rateLimitPerUser: channel.rateLimitPerUser,
                  permissions: channel.withPermissions,
                  position: channel.rawPosition,
                  reason:  `Salon recréé par ${message.author.tag} (${message.author.id})`
                })
                channel.delete()
                ee.send({ content: `${message.author} salon recréé` })
            } catch(err) {
                console.log(err)
            }
        }
  },
};
