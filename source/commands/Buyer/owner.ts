
import { Client, Message , EmbedBuilder, User} from "discord.js";

export default {
    name: "owner",
    aliases: ["owner"],
    description: "Affiche la liste des owners ou permet d add une personne aux owners",
    category: "🛠️〢Buyer",
    run: async (client: Client, message: Message, args: string[]) => {
  
        const isBuy = await client.functions.isBuy(client, message.author.id);
        if (!isBuy) {
          return message.reply({
            content: "Vous n'avez pas la permission d'utiliser cette commande",
          });
        }
        await client.db.none(`
        CREATE TABLE IF NOT EXISTS clarity_${client.user?.id}_${message.guild?.id}_owners (
            user_id VARCHAR(20) PRIMARY KEY
        )`);
        await client.db.none(
          `
      INSERT INTO clarity_${client.user?.id}_${message.guild?.id}_owners (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING
      `,
          [client.config.buyer]
        );
        const user = message.mentions.members?.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => { })

        if (!user) {
            const owners = await client.db.any(
                `SELECT user_id FROM clarity_${client.user?.id}_${message.guild?.id}_owners`
              );

            if (owners.length === 0)
              return message.reply({ content: "Aucun owner bot" });

            const ownTag = await Promise.all(owners.map(async (owner: any) => `[${(await client.users.fetch(owner.user_id)).tag}](https://discord.com/users/${owner.user_id}) (${owner.user_id})`));
              
            const ownemb = new EmbedBuilder()
                .setTitle(client.user?.username + " - " + "Liste des owners")
                .setDescription(ownTag.join('\n'))
                .setColor(parseInt(client.color.replace('#', ""), 16))
                .setFooter(client.config.footer);

                return message.reply({ embeds: [ownemb] });
        }

        const isAlreadyOwn = await client.db.oneOrNone(
            `
            SELECT 1 FROM clarity_${client.user?.id}_${message.guild?.id}_owners WHERE user_id = $1
            `,
            [user.id]
          );
          if (isAlreadyOwn) {
            return message.reply({ content: `${user} est déja owner` });
          }

          if (user instanceof User && user.bot) return message.reply({
            content: "Vous ne pouvez pas owner un bot.",
          });
          await client.db
          .none(
            `
          INSERT INTO clarity_${client.user?.id}_${message.guild?.id}_owners (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING
          `,
            [user.id]
          )
          .then(message.reply({ content: `${user} est maintenant owner` }))
          .catch((error: any) => {
            console.log(error)
            console.log("Erreur lors de la mise à jour de la DB : " + error);
            message.reply({
              content: "Une erreur s'est produite lors de l'ajout de l'owner.",
            });
          });




    },
  };
  