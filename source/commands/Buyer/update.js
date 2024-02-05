import { exec } from 'child_process';

export default {
    name: "update",
    description: "update le bot",
    run: async (client, message, args) => {
        const isBuy = await client.functions.isBuy(client, message.author.id);
        if (!isBuy) {
          return message.reply({
            content: "Vous n'avez pas la permission d'utiliser cette commande",
          });
        }
       let msg = await message.channel.send({content: "[-] Recherche de mise à jour en cours . . ."})
       try {
        const response = await axios.post(`http://${client.config.panel}/api/version`, { version: client.version });
    
        if (response.data.message === 'Mise à jour disponible en attente.') {
          message.channel.send(`\`${getCurrentTime()}\` [+] L'update du bot vient de commencer..`);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          message.channel.send(`\`${getCurrentTime()}\` [+] Téléchargement du bot en cours...`);
          await new Promise((resolve) => setTimeout(resolve, 3000));
          message.channel.send(`\`${getCurrentTime()}\` [+] Mise à jour des fichiers en cours..`);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          message.channel.send(`\`${getCurrentTime()}\` [+] Le bot va redémarrer...`);
          
          exec(`cd /home/bot/${client.user.id} && rm -r source lang && rm version.js index.js package.json package-lock.json && cd /home/Update && cp -r * /home/bot/${client.user.id} && npm i -g && pm2 restart gestion_${client.user.id}`, async (err, stdout, stderr) => {
            if (err) {
              console.error(err);
              message.channel.send(`\`${getCurrentTime()}\` ${await client.lang('update.erreur')}`);
            } else {
              message.channel.send(`\`${getCurrentTime()}\` [+] Update du bot terminé`);
            }
          });
        } else if (response.data.message === 'Aucune mise à jour disponible.') {
          message.channel.send("Votre bot est déjà à jour !");
        }
    
      } catch (error) {
        console.error(error);
        message.channel.send(`\`${getCurrentTime()}\` Une erreur est survenue.`);
      }
    }
}
