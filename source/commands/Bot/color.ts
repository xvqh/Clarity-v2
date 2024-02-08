
import {
    BaseGuildTextChannel,
    Client,
    Message,
    Role,
    GuildChannel,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ChannelType,
    User
} from "discord.js";

import { exec } from 'child_process';
import fs from 'fs';

export default {
  name: "theme",
  description: "Change the embed theme of the bot",
  category: "🤖〢Bot",

  run: async (client: Client, message: Message, args: string[]) => {
    if (!message.guild || !client.user) return;
    const isBuy = await client.functions.isBuy(client, message.author.id);
    if (!isBuy) {
      return message.reply({
        content: "Vous n'avez pas la permission d'utiliser cette commande",
      });
    }
    const color = args[0];
    if (!color) return message.reply({ content: "Précise la couleur" });
    if (color) {
      const configPath = './config/config.js';
      fs.readFile(configPath, 'utf8', (err, data) => {
        if (err) {
          console.error('Erreur lors de la lecture du fichier config.js :', err);
          return;
        }
        const updatedData = data.replace(/default_color: "#([0-9A-Fa-f]{6})"/, `default_color: "${color}"`);
        fs.writeFile(configPath, updatedData, 'utf8', async (err) => {
          if (err) {
            console.error('Erreur lors du changement de thème :', err);
            return;
          }
          console.log('Le thème du bot a été mis a jour');

          let msg = await message.channel.send({ content: "Changement du thème en cours" })
          exec(`pm2 restart gestion_${client.user?.id}`, () => false)
          msg.edit({ content: "Le thème du bot a été mis à jour" });
        })
      })
    }
  }
}


