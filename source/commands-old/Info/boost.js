import Discord from "discord.js";
import Clarity from "../../structures/client/index.js";
import moment from "moment";

export default {
  name: 'boost',
  aliases: [],
  /**
   * 
   * @param {Clarity} client 
   * @param {Discord.Message} message
   */
  run: async (client, message, args) => {
    let desc = "";
    await message.guild.members.cache
      .filter((m) => m.premiumSince)
      .map((m) => {
        desc += `${m} - ${moment(m.premiumSince).format(
          "[Le] DD/MM/YYYY [à] HH:mm:ss"
        )}\n`;
      });
    let color = parseInt(client.color.replace("#", ""), 16);
    message.channel.send({
      embeds: [{
        color: color,
        title: `Liste des boosters de ${message.guild.name}`,
        description: desc || "Ce serveur n'a aucun boost",
        footer: client.config.footer,
        timestamp: new Date()
      }
      ]
    })


  }
}


