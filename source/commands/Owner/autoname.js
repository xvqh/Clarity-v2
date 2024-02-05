export default {
  name: 'autoname',
  run: async (client, message, args) => {
    const isOwn = await client.db.oneOrNone(
      `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
      [message.author.id]
    );
    if (!isOwn) {
      return message.reply({
        content: "Vous n'avez pas la permission d'utiliser cette commande",
      });
    }

    let msg = await message.channel.send({
      content: "Module en cours de chargement . . . "
    })
    await update(client, message, msg)
  }
}
async function update(client, message, msg) {
  msg.edit({
    content: null,
    embeds: [{
      color: parseInt(client.color.replace("#", ""), 16),
      title: "Parametre Autoname",
      description: 'Choisis quel partie de l autoname tu souhaites configurer',
      footer: client.config.footer
    }],
    components: [{
      type: 1,
      components: [{
        type: 2,
        label: "Autoname membre",
        style: 2,
        custom_id: "autonamemembre_" + message.id
      }, {
        type: 2,
        label: "Autoname bot",
        style: 2,
        custom_id: "autonamebot_" + message.id
      }]
    }]
  })
  const collector = msg.createMessageComponentCollector({
    filter: (i) => i.user.id === message.author.id
  })
  collector.on("collect", async (i) => {
    i.deferUpdate()
    if (i.customId === `autonamemembre_${message.id}`) {
      let dbb = await client.data.get(`autonamemembre_${message.guild.id}`) || {
        name: null,
        status: false
      }
      msg.edit({
        content: null,
        embeds: [{
          color: parseInt(client.color.replace("#", ""), 16),
          title: "Parametre Autoname",
          fields: [{
            name: 'Text:',
            value: dbb?.name || 'Aucun texte défini',
            inline: true
          }, {
            name: 'Status:',
            value: dbb?.status ? '✅ Activer' : '❌ Désactiver',
            inline: true
          }],
          footer: client.config.footer
        }],
        components: [{
          type: 1,
          components: [{
            type: 2,
            label: "Text",
            style: 2,
            custom_id: "nametextm_" + message.id
          }, {
            type: 2,
            label: "Status",
            style: 2,
            custom_id: "namemstat_" + message.id
          }, {
            type: 2,
            label: "Reset",
            style: 4,
            custom_id: "namemreset_" + message.id
          }, {
            type: 2,
            label: "Back",
            style: 4,
            custom_id: "back_" + message.id
          }]
        }],
      })
    }
    if (i.customId === `autonamebot_${message.id}`) {
      let dbb = await client.data.get(`autonamebot_${message.guild.id}`) || {
        name: null,
        status: false
      }
      msg.edit({
        content: null,
        embeds: [{
          color: parseInt(client.color.replace("#", ""), 16),
          title: "Parametre Autoname",
          fields: [{
            name: 'Text:',
            value: dbb?.name || 'Aucun texte défini',
            inline: true
          }, {
            name: 'Status:',
            value: dbb?.status ? '✅ Activer' : '❌ Désactiver',
            inline: true
          }],
          footer: client.config.footer
        }],
        components: [{
          type: 1,
          components: [{
            type: 2,
            label: "Text",
            style: 2,
            custom_id: "nametextb_" + message.id
          }, {
            type: 2,
            label: "Status",
            style: 2,
            custom_id: "namebstat_" + message.id
          }, {
            type: 2,
            label: "Reset",
            style: 4,
            custom_id: "namebreset_" + message.id
          }, {
            type: 2,
            label: "Back",
            style: 4,
            custom_id: "back_" + message.id
          }]
        }]
      })
    }
  })
  client.on('interactionCreate', async (i) => {
    if (message.author.id === i.user.id) {
      if (i.customId === "back_" + message.id) {
        msg.edit({
          content: null,
          embeds: [{
            color: parseInt(client.color.replace("#", ""), 16),
            title: "Parametre Autoname",
            description: 'Choisis quel partie de l autoname tu souhaites configurer',
            footer: client.config.footer
          }],
          components: [{
            type: 1,
            components: [{
              type: 2,
              label: "Autoname membre",
              style: 2,
              custom_id: "autonamemembre_" + message.id
            }, {
              type: 2,
              label: "Autoname bot",
              style: 2,
              custom_id: "autonamebot_" + message.id
            }]
          }]
        })
      }
      if (i.customId === "nametextm_" + message.id) {
        try {
          let question = await message.reply({ content: "Veuillez envoyer le text de l autorename pour les membres " + `([${client.prefix}var] pour avoir la liste des variables)` });
          const collected = await message.channel.awaitMessages({
            filter: (m) => m.author.id === message.author.id,
            max: 1,
            time: 10000
          });

          const msg = collected.first();
          // set ds la db
          client.data.set(`autonamemembre_${message.guild.id}`, {
            name: msg.content
          })
          // confirmation de l enregistrement
          let confirm = await msg.reply({ content: "Le text de l autorename a bien été enregistré" });
          setTimeout(() => {
            confirm.delete();
            question.delete();
          }, 5000);
        } catch { }
      }
      if (i.customId === "namemstat_" + message.id) {
        let db = await client.data.get(`autonamemembre_${message.guild.id}`) || {
          name: null,
          status: false
        }
        let status = !db.status
        client.data.set(`autonamemembre_${message.guild.id}`, {
          name: db.name,
          status: status
        })
        msg.edit({
          content: null,
          embeds: [{
            color: parseInt(client.color.replace("#", ""), 16),
            title: "Parametre Autoname",
            description: 'Choisis quel partie de l autoname tu souhaites configurer',
            fields: [{
              name: 'Text:',
              value: db?.name || 'Aucun texte défini',
              inline: true
            }, {
              name: 'Status:',
              value: status ? '✅ Activer' : '❌ Désactiver',
              inline: true
            }],
            footer: client.config.footer
          }],
          components: [{
            type: 1,
            components: [{
              type: 2,
              label: "Text",
              style: 2,
              custom_id: "nametextm_" + message.id
            }, {
              type: 2,
              label: "Status",
              style: 2,
              custom_id: "namemstat_" + message.id
            }, {
              type: 2,
              label: "Reset",
              style: 4,
              custom_id: "namemreset_" + message.id
            }, {
              type: 2,
              label: "Back",
              style: 4,
              custom_id: "back_" + message.id
            }]
          }]
        })
      }
      if (i.customId === "nametextb_" + message.id) {
        try {
          let question = await message.reply({ content: "Veuillez envoyer le text de l autorename pour les bots " + `([${client.prefix}var] pour avoir la liste des variables)` });
          const collected = await message.channel.awaitMessages({
            filter: (m) => m.author.id === message.author.id,
            max: 1,
            time: 10000
          });
          const msg = collected.first();
          // set ds la db
          client.data.set(`autonamebot_${message.guild.id}`, {
            name: msg.content
          })
          // confirmation de l enregistrement
          let confirm = await msg.reply({ content: "Le text de l autorename a bien été enregistré" });
          setTimeout(() => {
            confirm.delete();
            question.delete();
          }, 5000);
        } catch { }
      }
      if (i.customId === "namebstat_" + message.id) {
        let db = await client.data.get(`autonamebot_${message.guild.id}`) || {
          name: null,
          status: false
        }
        if (db.hasOwnProperty('status')) {
          const currentStatus = db.status;
          const newStatus = !currentStatus;
          db.status = newStatus;
          client.data.set(`autonamebot_${message.guild.id}`, db);
          const status = db?.status === true ? "Le status a été activé avec succès" : "Le status a été désactivé avec succès";

          const reply = await message.reply({ content: status, ephemeral: true });
          setTimeout(async () => {
            await reply.delete();
          }, 2000);

        }
        msg.edit({
          content: null,
          embeds: [{
            color: parseInt(client.color.replace("#", ""), 16),
            title: "Parametre Autoname",
            fields: [{
              name: 'Text:',
              value: db?.name || 'Aucun texte défini',
              inline: true
            }, {
              name: 'Status:',
              value: db?.status ? '✅ Activer' : '❌ Désactiver',
              inline: true
            }],
            footer: client.config.footer
          }],
          components: [{
            type: 1,
            components: [{
              type: 2,
              label: "Text",
              style: 2,
              custom_id: "nametextb_" + message.id
            }, {
              type: 2,
              label: "Status",
              style: 2,
              custom_id: "namebstat_" + message.id
            }, {
              type: 2,
              label: "Reset",
              style: 4,
              custom_id: "namebreset_" + message.id
            }, {
              type: 2,
              label: "Back",
              style: 4,
              custom_id: "back_" + message.id
            }]
          }]
        })
      }


    }
  });
}
