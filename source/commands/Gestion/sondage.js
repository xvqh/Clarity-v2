module.exports = {
    name: "sondage",
    run: async(client, message, args) => {
        const isOwn = await client.db.oneOrNone(
            `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
            [message.author.id]
          );
          if (!isOwn) {
            return message.reply({
              content: "Vous n'avez pas la permission d'utiliser cette commande",
            });
          }
      if (!args[0]) return message.channel.send({embeds: [{
        title: `Veuillez fournir un message !`,
        color: parseInt(client.color.replace("#", ""), 16),
        footer: client.config.footer,
        timestamp: new Date()
      }]})
      let msg = await message.channel.send({embeds: [{
        description: "Création du sondage en cours",
        color: parseInt(client.color.replace("#", ""), 16),
        footer: client.config.footer,
        timestamp: new Date()
      }]})
      update(client, message, msg, args)
    }
}
async function update(client, message, msg, args) {
  // cree 2 boutons avec en emoji : ✅ , ❌ et en label un texte avec le nombre d intéraction
  let voters = new Set();
  let voteCount = {
    votey: 0,
    voten: 0
  };
  await msg.edit({ embeds: [{
    title: `${message.author.username} vient de lancé un Sondage`,
    color: parseInt(client.color.replace("#", ""), 16),
    footer: client.config.footer,
    timestamp: new Date(),
    description: `${args.join(" ")}`,
    fields: [{
      name: "Nombre de vote",
      value: `\`\`\`✅ : ${voteCount.votey}\n❌ : ${voteCount.voten}\`\`\``
    }]
  }], components: [{
    type: 1,
    components: [
      {
        type: 2,
        label: "✅",
        style: 2,
        custom_id: "votey" + message.id
      },
      {
        type: 2,
        label: "❌",
        style: 2,
        custom_id: "voten" + message.id
      }
    ]
  }]
});



const collector = msg.createMessageComponentCollector({});
collector.on("collect", (i) => {
  i.deferUpdate()
  if (voters.has(i.user.id)) {
    i.user.send({
      content: "Vous avez deja voté pour ce sondage !",
      embeds: [{
        title: message.guild.name + " " + "sondage",
        color: parseInt(client.color.replace("#", ""), 16),
        footer: client.config.footer,
        timestamp: new Date(),
        description: `${args.join(" ")}`,
        fields: [{
          name: "Nombre de vote",
          value: `\`\`\`✅ : ${voteCount.votey}\n❌ : ${voteCount.voten}\`\`\``
        }]
      }]
    })
    return;
  }
  voters.add(i.user.id);
  if (i.customId === "votey" + message.id) {
    voteCount.votey++;
    msg.edit({ embeds: [{
      title: `${message.author.username} vient de lancé un Sondage`,
      footer: client.config.footer,
      timestamp: new Date(),
      description: `${args.join(" ")}`,
      fields: [{
        name: "Nombre de vote",
        value: `\`\`\`✅ : ${voteCount.votey}\n❌ : ${voteCount.voten}\`\`\``
      }]
    }], components: [{
      type: 1,
      components: [
        {
          type: 2,
          label: "✅",
          style: 1,
          custom_id: "votey" + message.id
        },
        {
          type: 2,
          label: "❌",
          style: 4,
          custom_id: "voten" + message.id
        }
      ]
    }]
  });
  } else if (i.customId === "voten" + message.id) {
    voteCount.voten++;
    msg.edit({ embeds: [{
      title: `${message.author.username} vient de lancé un Sondage`,
      footer: client.config.footer,
      timestamp: new Date(),
      description: `${args.join(" ")}`,
      fields: [{
        name: "Nombre de vote",
        value: `\`\`\`✅ : ${voteCount.votey}\n❌ : ${voteCount.voten}\`\`\``
      }]
    }], components: [{
      type: 1,
      components: [
        {
          type: 2,
          label: "✅",
          style: 1,
          custom_id: "votey" + message.id
        },
        {
          type: 2,
          label: "❌",
          style: 4,
          custom_id: "voten" + message.id
        }
      ]
    }]
  });
  }
  })
}

