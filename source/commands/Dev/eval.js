const Discord = require("discord.js");
const { Clarity } = require("../../structures/client/index");

module.exports = {
  name: "eval",
  description: "Evaluer une commande",
category: "🔗〢Dev",
  run: async (client, message, args) => {
    if (!client.config.devs.includes(message.author.id)) return message.reply({
      content: "Vous n'avez pas la permission pour faire cette commande"
  })
  if (client.config.devs.includes(message.author.id)) {
    try {
        let codein = args.join(" ");
        let code = eval(codein);
        if (typeof code !== 'string')
        code = require('util').inspect(code, {
            depth: 0
        });
        message.channel.send({
            embeds: [{
                description:  ":inbox_tray: Entrée \`\`\`js\n"
                + codein + "\`\`\`\n:outbox_tray: Sortie\`\`\`js\n" 
                + code + "\`\`\`"
            }]
        })
    } catch (e) {
        message.channel.send({content: `\`\`\`js\n${e}\n\`\`\``})
    }
  }
  },
};
