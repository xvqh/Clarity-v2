import { Client, ComponentType, EmbedBuilder, Message, User } from "discord.js";

export default {
    name: "marry",
    description: "Marie deux utilisateurs",
    category: "fun",
    aliases: ["marry"],
    run: async (client: Client, message: Message, args: string[]) => {
        const user =
        message.mentions.users.first() || client.users.cache.get(args[0]);
      if (!user) {
        return message.reply(
          "vous devez mentionner la personne avec laquelle vous voulez vous marrier."
        );
      }
      if (user instanceof User && user.bot) {
        return message.reply("vous ne pouvez pas vous marrier avec un bot.");
      }

      let db = client.data.get(`family_${message.author.id}`) || {
        sister: [],
        brother: [],
        children: [],
        parent: [],
        marry: null,
      };

      if (db.marry) {
        message.reply(
          `Vous etes deja marie avec ${client.users.cache.get(db.marry)}`
        );
        return;
      }

      if (
        client.data.get(`family_${user.id}`) &&
        client.data.get(`family_${user.id}`).marry === message.author.id
      ) {
        message.reply(`Vous etes deja marie avec ${user}`);
        return;
      } else {
        const author = message.author;
        const emb = new EmbedBuilder()
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL({ forceStatic: false }),
          })
          .setDescription(
            `${message.author.username} vous demandes en mariage. Cliquez sur le bouton correspondant pour accepter ou refuser le mariage.`
          )
          .setColor(parseInt(client.color.replace("#", ""), 16))
          .setFooter(client.config.footer)
          .setTimestamp();

          let sentM = await user.send({
            embeds: [emb],
            components: [
                {
                    type: 1,
                    components: [
                      {
                        type: 2,
                        label: "Accepter",
                        style: 3,
                        custom_id: "accepter",
                      },
                      {
                        type: 2,
                        label: "Refuser",
                        style: 4,
                        custom_id: "refuser",
                      },
                    ],
                  }
            ]
          });

          const collector = sentM.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 30000 * 1000 * 3,
          });
          collector.on("collect", async (b: any) => {
            if (b.customId === "accepter") {
                client.data.set(`family_${message.author.id}`, {
                    sister: [],
                    brother: [],
                    children: [],
                    parent: [],
                    marry: user.id,
                  });
                  client.data.set(`family_${user.id}`, {
                    sister: [],
                    brother: [],
                    children: [],
                    parent: [],
                    marry: message.author.id,
                  });
                  b.reply({
                    content: `Vous avez accepté le mariage avec ${author.username}`,
                    ephemeral: true,
                  });
                  author.send({
                    content: `${user.username} a accepter de se marier avec vous : ${author}`,
                  });
                  return;
            }
            if (b.customId === "refuser") {
                b.reply({
                    content: `Vous avez refuser le mariage avec ${author.username}`,
                    ephemeral: true,
                  });
                  author.send({
                    content: `${user.username} a refuser de se marier avec vous ${author}`,
                  });
                  return;
                }
            })
                  
      }


    }
}
