
import { Client, Message , EmbedBuilder, User} from "discord.js";

export default {
    name: "buyer",
    aliases: ["buyers"],
    description: "Affiche la liste des buyers ou permet d add une personne aux buyers",
    category: "🛠️〢Buyer",
    run: async (client: Client, message: Message, args: string[]) => {
  
      if (message.author.id != client.config.buyer) {
        return message.reply({
          content: "Vous n'avez pas la permission d'utiliser cette commande",
        });
      }
      await client.db.none(`
      CREATE TABLE IF NOT EXISTS clarity_${client.user?.id}_buyers (
          user_id VARCHAR(20) PRIMARY KEY
      )`);
      await client.db.none(
        `
    INSERT INTO clarity_${client.user?.id}_buyers (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING
    `,
        [client.config.buyer]
      );
      let color = parseInt(client.color.replace('#', ''), 16);
      const user = message.mentions.members?.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => { })
      if (!user) {
        const buyers = await client.db.any(
          `SELECT user_id FROM clarity_${client.user?.id}_buyers`
        );
  
        if (buyers.length === 0)
          return message.reply({ content: "Aucun buyer" });
        const ownTag = await Promise.all(buyers.map(async (owner: any) => `[${(await client.users.fetch(owner.user_id)).tag}](https://discord.com/users/${owner.user_id}) (${owner.user_id})`))
        const ownemb = new EmbedBuilder()
          .setTitle(client.user?.username + " - " + "Liste des buyers")
          .setDescription(ownTag.join('\n'))
          .setColor(color)
          .setFooter(client.config.footer);
        return message.reply({ embeds: [ownemb] });
      }
  
      const isAlreadyOwn = await client.db.oneOrNone(
        `
        SELECT 1 FROM clarity_${client.user?.id}_buyers WHERE user_id = $1
        `,
        [user.id]
      );
      if (isAlreadyOwn) {
        return message.reply({ content: `${user} est déja buyer` });
      }
      if (user instanceof User && user.bot) return message.reply({
        content: "Vous ne pouvez pas mettre un bot buyer.",
      });
  
      await client.db
        .none(
          `
        INSERT INTO clarity_${client.user?.id}_buyers (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING
        `,
          [user.id]
        )
        .then(message.reply({ content: `${user} est maintenant buyer` }))
        .catch((error: any) => {
            console.log("Erreur lors de la mise à jour de la DB : " + error);
          message.reply({
            content: "Une erreur s'est produite lors de l'ajout du buyer.",
          });
        });
  
    },
  };
  