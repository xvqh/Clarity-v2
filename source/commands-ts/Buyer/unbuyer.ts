
import { Client, Message , EmbedBuilder, User} from "discord.js";

export default {
    name: "unbuyer",
    aliases: ["unbuyers"],
    description: "Supprime un membre de la liste des buyers",
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
     
      const user = message.mentions.members?.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => { })

      if (!user) {
        return message.reply({ content: "Veuillez mentionner un utilisateur à retirer des buyers." });
      }

      const isBlacked = await client.db.oneOrNone(
        `SELECT 1 FROM clarity_${client.user?.id}_buyers WHERE user_id = $1`,
        [user.id]
      )

    
      if (!isBlacked) {
        return message.reply({ content: `${user} n'est pas buyer.` });
      }

      await client.db.any(
        `DELETE FROM clarity_${client.user?.id}_buyers WHERE user_id = $1`,
        [user.id]
      )
      .then(()=>{
        message.reply({ content: `${user} a bien été retiré des buyers.` });
      })
      .catch((e: any)=>{
        console.log("Erreur lors de la mise à jour de la DB : " + e);
        message.reply({ content: `Une erreur est survenue : ${e}` });
      })
  
    },
  };
  