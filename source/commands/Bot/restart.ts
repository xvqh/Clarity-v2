
import { exec } from 'child_process';
import { Client, Message } from 'discord.js';

export default {
  name: "restart",
  aliases: [],
  description: "Permet de redémarrer le bot",
  category: "🛠️〢Buyer",

  run: async (client: Client, message: Message, args: string[]) => {
    if (!message.guild || !client.user) return;
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

