import Clarity from "../../structures/client/index.js";
import { exec } from 'child_process';

export default {
  name: "restart",
  aliases: [],
  description: "Permet de redémarrer le bot",
  category: "🛠️〢Buyer",
  /**
  * @param {Clarity} client
  */
  run: async (client, message, args) => {
    if(client.config.devs.includes(message.author.id)){
      let msg = await message.channel.send({content: "Redémarrage en cours..."})
      exec(`pm2 restart ${client.user.id}`, () => false)
      return msg.edit({content: "[+] Redémarrage terminé avec succès"});
    } else {
      const isBuy = await client.functions.isBuy(client, message.author.id);
      if (!isBuy) {
        return message.reply({
          content: "Vous n'avez pas la permission d'utiliser cette commande",
        });
      }
      let msg = await message.channel.send({content: "Redémarrage en cours..."})
      exec(`pm2 restart gestion_${client.user.id}`, () => false)
      return msg.edit({content: "[+] Redémarrage terminé avec succès"});
    }
  },
};

