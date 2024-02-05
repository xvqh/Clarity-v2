import Discord from "discord.js";
import { EmbedBuilder } from 'discord.js';

export default {
  name: "autorole",
  category: "⚙️〢Owner",
  run: async (client, message) => {
    if (client.config.devs.includes(message.author.id)) {
      let msg = await message.channel.send({
        content: "Module en cours de chargement . . . "
      })
      await update(client, message, msg)
    } else {
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
}
async function update(client, message, msg) {
  msg.edit({
    content: null,
    embeds: [{
      color: parseInt(client.color.replace("#", ""), 16),
      title: "Parametre Autorole",
      description: 'Choisis quel partie de l autorole tu souhaites configurer',
      footer: client.config.footer
    }],
    components: [{
      type: 1,
      components: [{
        type: 2,
        label: "Autorole membre",
        style: 2,
        custom_id: "autorolemembre_" + message.id
      }, {
        type: 2,
        label: "Autorole bot",
        style: 2,
        custom_id: "autorolebot_" + message.id
      }]
    }]
  })
  const collector = msg.createMessageComponentCollector({
    filter: (i) => i.user.id === message.author.id
  })
  collector.on("collect", async (i) => {
    i.deferUpdate()
    if (i.customId === `autorolemembre_${message.id}`) {
      let db = await client.data.get(`autorolem_${message.guild.id}`) || {
        role: [],
        status: false
      }
      msg.edit({
        content: null,
        embeds: [{
          color: parseInt(client.color.replace("#", ""), 16),
          title: "Parametre Autorole",
          fields: [{
            name: 'Role:',
            value: db?.role?.map((r) => `<@&${r}>`).join(" ") ? db?.role?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
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
            label: "Role",
            style: 2,
            custom_id: "setrolem_" + message.id
          }, {
            type: 2,
            label: "Status",
            style: 2,
            custom_id: "rolemstat_" + message.id
          }, {
            type: 2,
            label: "Reset",
            style: 4,
            custom_id: "rolemreset_" + message.id
          }, {
            type: 2,
            label: "Back",
            style: 4,
            custom_id: "back_" + message.id
          }]
        }],
      })
    }
    if (i.customId === `autorolebot_${message.id}`) {
      let dbb = await client.data.get(`autorolebot_${message.guild.id}`) || {
        role: [],
        status: false
      }
      msg.edit({
        content: null,
        embeds: [{
          color: parseInt(client.color.replace("#", ""), 16),
          title: "Parametre Autorole",
          fields: [{
            name: 'Role:',
            value: dbb?.role?.map((r) => `<@&${r}>`).join(" ") ? dbb?.role?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
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
            label: "Role",
            style: 2,
            custom_id: "setroleb_" + message.id
          }, {
            type: 2,
            label: "Status",
            style: 2,
            custom_id: "rolebstat_" + message.id
          }, {
            type: 2,
            label: "Reset",
            style: 4,
            custom_id: "rolebreset_" + message.id
          }, {
            type: 2,
            label: "Back",
            style: 4,
            custom_id: "back_" + message.id
          }]
        }],
      })

    }
  })
  client.on('interactionCreate', async (i) => {
    if (message.author.id === i.user.id) {
      if (i.customId === "setrolem_" + message.id) {
        let db = await client.data.get(`autorolem_${message.guild.id}`) || {
          role: [],
          status: false
        }
        const rolesEmbed = new EmbedBuilder()
          .setColor(parseInt(client.color.replace("#", ""), 16))
          .setFooter(client.config.footer)
          .addFields({
            name: 'Autorole membre',
            value: db?.role?.map((r) => `<@&${r}>`).join(" ") ? db?.role?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
            inline: true
          })
        const salonrow = new Discord.ActionRowBuilder().addComponents(
          new Discord.RoleSelectMenuBuilder()
            .setCustomId('autorolem_setup_role_' + message.id)
            .setMaxValues(25)
        )
        msg.edit({ embeds: [rolesEmbed], components: [salonrow] })
      }
      if (i.customId === "rolemstat_" + message.id) {
        let db = await client.data.get(`autorolem_${message.guild.id}`) || {
          role: [],
          status: false
        }
        if (db.hasOwnProperty('status')) {
          const currentStatus = db.status;
          const newStatus = !currentStatus;
          db.status = newStatus;
          client.data.set(`autorolem_${message.guild.id}`, db);
          const status = db?.status === true ? "Le status a été activé avec succès" : "Le status a été désactivé avec succès";

          const reply = await message.reply({ content: status, ephemeral: true });
          setTimeout(async () => {
            await reply.delete();
          }, 2000);


          msg.edit({
            content: null,
            embeds: [{
              color: parseInt(client.color.replace("#", ""), 16),
              title: "Parametre Autorole",
              fields: [{
                name: 'Role:',
                value: db?.role?.map((r) => `<@&${r}>`).join(" ") ? db?.role?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
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
                label: "Role",
                style: 2,
                custom_id: "setrolem_" + message.id
              }, {
                type: 2,
                label: "Status",
                style: 2,
                custom_id: "rolemstat_" + message.id
              }, {
                type: 2,
                label: "Reset",
                style: 4,
                custom_id: "rolemreset_" + message.id
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
      if (i.customId === `rolemreset_` + message.id) {
        let db = await client.data.get(`autorolem_${message.guild.id}`) || {
          role: [],
          status: false
        }
        db.role = []
        db.status = false
        client.data.set(`autorolem_${message.guild.id}`, db)
        msg.edit({
          content: null,
          embeds: [{
            color: parseInt(client.color.replace("#", ""), 16),
            title: "Parametre Autorole",
            fields: [{
              name: 'Role:',
              value: db?.role?.map((r) => `<@&${r}>`).join(" ") ? db?.role?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
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
              label: "Role",
              style: 2,
              custom_id: "setroleb_" + message.id
            }, {
              type: 2,
              label: "Status",
              style: 2,
              custom_id: "rolebstat_" + message.id
            }, {
              type: 2,
              label: "Reset",
              style: 4,
              custom_id: "rolebreset_" + message.id
            }, {
              type: 2,
              label: "Back",
              style: 4,
              custom_id: "back_" + message.id
            }]
          }]
        })
      }
      if (i.customId === `rolebstat_` + message.id) {
        let dbb = await client.data.get(`autorolebot_${message.guild.id}`) || {
          role: [],
          status: false
        }
        if (dbb.hasOwnProperty('status')) {
          const currentStatus = dbb.status;
          const newStatus = !currentStatus;
          dbb.status = newStatus;
          client.data.set(`autorolebot_${message.guild.id}`, dbb);
          const status = dbb?.status === true ? "Le status a été activé avec succès" : "Le status a été désactivé avec succès";

          const reply = await message.reply({ content: status, ephemeral: true });
          setTimeout(async () => {
            await reply.delete();
          }, 2000);


          msg.edit({
            content: null,
            embeds: [{
              color: parseInt(client.color.replace("#", ""), 16),
              title: "Parametre Autorole",
              fields: [{
                name: 'Role:',
                value: dbb?.role?.map((r) => `<@&${r}>`).join(" ") ? dbb?.role?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
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
                label: "Role",
                style: 2,
                custom_id: "setroleb_" + message.id
              }, {
                type: 2,
                label: "Status",
                style: 2,
                custom_id: "rolebstat_" + message.id
              }, {
                type: 2,
                label: "Reset",
                style: 4,
                custom_id: "rolebreset_" + message.id
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
      if (i.customId === `setroleb_${message.id}`) {
        let dbb = await client.data.get(`autorolebot_${message.guild.id}`) || {
          role: [],
          status: false
        }
        const rolesEmbed = new EmbedBuilder()
          .setColor(parseInt(client.color.replace("#", ""), 16))
          .setFooter(client.config.footer)
          .addFields({
            name: 'Autorole bot',
            value: dbb?.role?.map((r) => `<@&${r}>`).join(" ") ? dbb?.role?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
            inline: true
          })
        const salonrow = new Discord.ActionRowBuilder().addComponents(
          new Discord.RoleSelectMenuBuilder()
            .setCustomId('autoroleb_setup_role_' + message.id)
            .setMaxValues(25)
        )
        await msg.edit({ embeds: [rolesEmbed], components: [salonrow] })
      }
      if (i.customId === "rolebreset_" + message.id) {
        let dbb = await client.data.get(`autorolebot_${message.guild.id}`) || {
          role: [],
          status: false
        }
        dbb.role = []
        dbb.status = false
        client.data.set(`autorolebot_${message.guild.id}`, dbb)
        msg.edit({
          content: null,
          embeds: [{
            color: parseInt(client.color.replace("#", ""), 16),
            title: "Parametre Autorole",
            fields: [{
              name: 'Role:',
              value: dbb?.role?.map((r) => `<@&${r}>`).join(" ") ? dbb?.role?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
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
              label: "Role",
              style: 2,
              custom_id: "setroleb_" + message.id
            }, {
              type: 2,
              label: "Status",
              style: 2,
              custom_id: "rolebstat_" + message.id
            }, {
              type: 2,
              label: "Reset",
              style: 4,
              custom_id: "rolebreset_" + message.id
            }, {
              type: 2,
              label: "Back",
              style: 4,
              custom_id: "back_" + message.id
            }]
          }]
        })
      }
      if (i.customId === "back_" + message.id) {
        msg.edit({
          content: null,
          embeds: [{
            color: parseInt(client.color.replace("#", ""), 16),
            title: "Parametre Autorole",
            description: 'Choisis quel partie de l autorole tu souhaites configurer',
            footer: client.config.footer
          }],
          components: [{
            type: 1,
            components: [{
              type: 2,
              label: "Autorole membre",
              style: 2,
              custom_id: "autorolemembre_" + message.id
            }, {
              type: 2,
              label: "Autorole bot",
              style: 2,
              custom_id: "autorolebot_" + message.id
            }]
          }]
        })
      }


    }
  })

  client.on("interactionCreate", async interaction => {
    if (message.author.id === interaction.user.id) {
      if (interaction.customId === "autorolem_setup_role_" + message.id) {
        let db = await client.data.get(`autorolem_${message.guild.id}`) || {
          role: [],
          status: false
        }
        const rolee = interaction.values;
        if (db.hasOwnProperty('role')) {
          db.role = rolee
          client.data.set(`autorolem_${message.guild.id}`, db)
        } else {
          client.data.set(`autorolem_${message.guild.id}`, db)
        }
        msg.edit({
          content: null,
          embeds: [{
            color: parseInt(client.color.replace("#", ""), 16),
            title: "Parametre Autorole",
            fields: [{
              name: 'Role:',
              value: db?.role?.map((r) => `<@&${r}>`).join(" ") ? db?.role?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
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
              label: "Role",
              style: 2,
              custom_id: "setrolem_" + message.id
            }, {
              type: 2,
              label: "Status",
              style: 2,
              custom_id: "rolemstat_" + message.id
            }, {
              type: 2,
              label: "Reset",
              style: 4,
              custom_id: "rolemreset_" + message.id
            }, {
              type: 2,
              label: "Back",
              style: 4,
              custom_id: "back_" + message.id
            }]
          }]
        })
      }
      if (interaction.customId === "autoroleb_setup_role_" + message.id) {
        let dbb = await client.data.get(`autorolebot_${message.guild.id}`) || {
          role: [],
          status: false
        }
        const rolee = interaction.values;
        if (dbb.hasOwnProperty('role')) {
          dbb.role = rolee
          client.data.set(`autorolebot_${message.guild.id}`, dbb)
        } else {
          client.data.set(`autorolebot_${message.guild.id}`, dbb)
        }
        msg.edit({
          content: null,
          embeds: [{
            color: parseInt(client.color.replace("#", ""), 16),
            title: "Parametre Autorole",
            fields: [{
              name: 'Role:',
              value: dbb?.role?.map((r) => `<@&${r}>`).join(" ") ? dbb?.role?.map((r) => `<@&${r}>`).join(" ") : 'Non configurer',
              inline: true
            }, {
              name: 'Status:',
              value: dbb?.status ? '✅ Activer' : '❌ Désactiver',
              inline: true
            }
            ],
          }],
          components: [{
            type: 1,
            components: [{
              type: 2,
              label: "Role",
              style: 2,
              custom_id: "setroleb_" + message.id
            }, {
              type: 2,
              label: "Status",
              style: 2,
              custom_id: "rolebstat_" + message.id
            }, {
              type: 2,
              label: "Reset",
              style: 4,
              custom_id: "rolebreset_" + message.id
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
  })
}
