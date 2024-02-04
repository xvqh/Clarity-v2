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
let voters = new Set();
let voteCount = {
  votey: 0,
  voten: 0
};
const updateVoteCount = async () => {
  await msg.edit({
    embeds: [{
      title: `${message.author.username} vient de lancer un Sondage`,
      color: parseInt(client.color.replace("#", ""), 16),
      footer: client.config.footer,
      timestamp: new Date(),
      description: `${args.join(" ")}`,
      fields: [{
        name: "Nombre de vote",
        value: `\`\`\`✅ : ${voteCount.votey}\n❌ : ${voteCount.voten}\`\`\``
      }]
    }],
    components: [{
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
};
await updateVoteCount();
const collector = msg.createMessageComponentCollector({});
collector.on("collect", (i) => {
  if (voters.has(i.user.id)) {
    i.reply({
      content: "Vous avez déjà voté pour ce sondage !",
      embeds: [{
        title: message.guild.name + " " + "sondage",
        footer: client.config.footer,
        color: parseInt(client.color.replace("#", ""), 16),
        timestamp: new Date(),
        description: `${args.join(" ")}`,
        fields: [{
          name: "Nombre de vote",
          value: `\`\`\`✅ : ${voteCount.votey}\n❌ : ${voteCount.voten}\`\`\``
        }]
      }],
      flags: 64
    });
    return;
  }
  i.deferUpdate();
  voters.add(i.user.id);
  if (i.customId === "votey" + message.id) {
    voteCount.votey++;
  } else if (i.customId === "voten" + message.id) {
    voteCount.voten++;
  }
});

setInterval(updateVoteCount, 10000);
}




