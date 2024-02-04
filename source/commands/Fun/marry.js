module.exports = {
  name: "marry",
  description: "Marriez-vous avec quelqu'un!",
  run: async (client, message, args) => {
    const user =
      message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) {
      return message.reply(
        "vous devez mentionner la personne avec laquelle vous voulez vous marrier."
      );
    }
    if (user.bot) {
      return message.reply("vous ne pouvez pas vous marrier avec un bot.");
    }
    let db = client.data.get(`family_${message.author.id}`) || {
      sister: [],
      brother: [],
      children: [],
      parent: [],
      marry: null,
    };

    // if message author is already maried
    if (db.marry) {
      message.reply(
        `Vous etes deja marie avec ${client.users.cache.get(db.marry)}`
      );
      return;
    }
    // if user is alredy maried with the message author
    if (
      client.data.get(`family_${user.id}`) &&
      client.data.get(`family_${user.id}`).marry === message.author.id
    ) {
      message.reply(`${user.username} est deja marie avec vous`);
      return;
    } else {
      const author = message.author;
      let sentM = await user.send({
        embeds: [
          {
            author: {
              name: message.author.username,
              icon_url: message.author.displayAvatarURL({ dynamic: true }),
            },
            color: parseInt(client.color.replace("#", ""), 16),
            description: `${message.author.username} vous demandes en mariage. Cliquez sur le bouton correspondant pour accepter ou refuser le mariage.`,
            footer: client.config.footer,
          },
        ],
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
          },
        ],
      });
      const collector = sentM.createMessageComponentCollector({
        componentType: 2,
      });
      collector.on("collect", async (i) => {
        if (i.customId.startsWith("accepter")) {
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
          i.reply({
            content: `Vous avez accepté le mariage avec ${author.username}`,
            ephemeral: true,
          });
          author.send({
            content: `${user.username} a accepter de se marier avec vous : ${author}`,
          });
          return;
        }
        if (i.customId.startsWith("refuser")) {
          i.reply({
            content: `Vous avez refuser le mariage avec ${author.username}`,
            ephemeral: true,
          });
          author.send({
            content: `${user.username} a refuser de se marier avec vous ${author}`,
          });
          return;
        }
      });
    }
  },
};
