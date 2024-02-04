const ms = require('ms');
const Discord = require('discord.js')
const { StringSelectMenuBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    name: "soutien",
   category: "🔨〢Gestion",
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
          const originalmsg = await message.channel.send({content: "Chargement en cours..."});

          async function updateEmbed() {
              const db = client.data2.get(`soutien_${message.guild.id}`) || client.data2.set(`soutien_${message.guild.id}`,
                  {
                      name: [],
                      role: [],
                      blacklist: [],
                      only: false,
                      allowed: false,
                      status: false
                  })
              const status = db?.status === true ? "✅ Activer" : "❌ Désactiver";
              const role = db?.role;
              const name = db.name ? db.name : "Aucun status définie"
              const rolename = role
              ? await Promise.all(role.map(async (roleId) => (await message.guild.roles.fetch(roleId))?.name || "Inconnu"))
              : [];
              const blacklist = db?.blacklist;
              const blacklistname = blacklist ? await Promise.all(blacklist.map(async (roleId) => (await message.guild.roles.fetch(roleId))?.name || "Inconnu")) : [];
          
              const embed = new EmbedBuilder()
                  .setTitle("Panel Soutien")
                  .setColor(parseInt(client.color.replace("#", ""), 16))
                  .setFooter(client.config.footer)
                  .addFields(
                      { name: "Statut :", value: `\`\`\`yml\n${status}\`\`\``, inline: true },
                      { name: "Status personaliser", value: ` \`\`\`yml\n${name.join('\n')}\`\`\``, inline: true },
                      { name: "Accepter les liens d'invitation du serveur", value: `\`\`\`yml\n${db?.allowed === true ? "✅" : "❌"}\`\`\``, inline: true},
                      { name: "Status uniquement", value: `\`\`\`yml\n${db?.only === true? "✅" : "❌"}\`\`\``, inline: true},
                      { name:"Rôles Soutien :", value: `\`\`\`yml\n${rolename.join(', ') || "Aucun rôle défini"}\`\`\``, inline: true },
                      { name: 'Rôles interdits :', value: `\`\`\`yml\n${blacklistname.join(', ') || "Aucun rôle interdit défini"}\`\`\``, inline: true}
  
                  )
  
              const buttonreset = new Discord.ButtonBuilder()
                  .setCustomId('soutien_reset_' + message.id)
                  .setLabel("Reset")
                  .setEmoji('⚠️')
                  .setStyle(Discord.ButtonStyle.Danger)
  
              const select = new StringSelectMenuBuilder()
                  .setCustomId(`soutien_setup_` + message.id)
                  .setMaxValues(1)
                  .addOptions([
                      {
                          label: "Status",
                          value: 'status_' + message.id,
                      },
                      {
                          label:  "Status personaliser",
                          value: 'statusperso_' + message.id,
                      },
                      {
                          label: "Rôles",
                          value: 'role_' + message.id,
                      },
                      {
                          label: "Rôles interdits",
                          value: 'blacklist_' + message.id,
                      }, {
                        label: "Accepter les liens d'invitation du serveur",
                        value: 'allowed_' + message.id,
                      }, {
                        label: "Status uniquement",
                        value: 'only_' + message.id,
                      }
  
                  ])
  
              const roworig = new ActionRowBuilder()
                  .addComponents(select);
  
  
              const rowbutton = new ActionRowBuilder()
                  .addComponents(buttonreset);
  
              originalmsg.edit({ content: null, components: [roworig, rowbutton], embeds: [embed] });
          }
          await updateEmbed();
  
          const collector = message.channel.createMessageComponentCollector({ filter: m => m.user.id == message.author.id, componentType: Discord.ComponentType.StringSelect || Discord.ComponentType.Button, time: ms("2m") })
  
          collector.on("collect", async (i) => {
              const db = client.data2.get(`soutien_${message.guild.id}`)
              if (i.values[0] === `status_${message.id}`) {
                  let missingOptions = [];
  
                  if (!db) {
                      missingOptions.push("Aucun status définie");
                  } else {
                      if (db.role === null) {
                          missingOptions.push("Aucun rôle défini");
                      }
                      if (db.name === null) {
                          missingOptions.push("Le status personaliser");
                      }
                      if (missingOptions.length === 0) {
                          if (db.hasOwnProperty('status')) {
                              const currentStatus = db.status;
                              const newStatus = !currentStatus;
                              db.status = newStatus;
                              client.data2.set(`soutien_${message.guild.id}`, db);
                              const status = db?.status === true ? "Le status a été activé avec succès" : "Le status a été désactivé avec succès";
  
                              const reply = await i.reply({ content: status, ephemeral: true });
                              setTimeout(async () => {
                                  await reply.delete();
                              }, 2000);
  
                              await updateEmbed();
                          }
  
                      } else {
                          const missingOptionsString = missingOptions.map(option => `- \`${option}\``).join('\n');
                          i.reply({ embeds: [], components: [], content: `Le paramétrage du soutien n'est pas fini. Voici ce qu'il reste à configurer :\n${missingOptionsString}`, ephemeral: true });
                      }
                  }
              } else if (i.values[0] === `role_${message.id}`) {
                  const salonrow = new Discord.ActionRowBuilder().addComponents(
                      new Discord.RoleSelectMenuBuilder()
                          .setCustomId('soutien_setup_role_' + message.id)
                          .setMaxValues(25)
                  )
                  i.reply({ embeds: [], content: "Merci de choisir vos rôle !", components: [salonrow] })
  
              } else if (i.values[0] === 'statusperso_' + message.id) {
                 const soutienRow = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('soutien_setup_addstatus_' + message.id)
                    .setEmoji('➕')
                    .setStyle(Discord.ButtonStyle.Secondary),
                    new Discord.ButtonBuilder()
                    .setCustomId('soutien_setup_delstatus_' + message.id)
                    .setEmoji('➖')
                    .setStyle(Discord.ButtonStyle.Secondary)
                 )
                 i.reply({ embeds: [], content: "Merci de choisir une option !", components: [soutienRow] })
              } else if (i.values[0] === `blacklist_${message.id}`) {
                const salonrow = new Discord.ActionRowBuilder().addComponents(
                    new Discord.RoleSelectMenuBuilder()
                       .setCustomId('soutien_setup_blacklist_' + message.id)
                       .setMaxValues(25)
                )
                i.reply({ embeds: [], content: "Merci de choisir vos rôle!", components: [salonrow] })
              }
              else if (i.values[0] === `allowed_${message.id}`) {
                if(db.hasOwnProperty('allowed')) {
                    const currentStatus = db.allowed;
                    const newStatus =!currentStatus;
                    db.allowed = newStatus;
                    client.data2.set(`soutien_${message.guild.id}`, db);
                    const status = db?.allowed === true? "Les liens d'invitation du serveur ont été activés pour le soutien avec succès" : "Les liens d'invitation du serveur ont été désactivés pour le soutien avec succès";
                    i.reply({ content: status, ephemeral: true });
                    setTimeout(async () => {
                        await reply.delete();
                    }, 2000);
                    await updateEmbed();
                    } else {
                        i.reply({ embeds: [], components: [], content: "Les liens d'invitation du serveur n'ont pas été activés pour le soutien", ephemeral: true });
                }
              }
              else if (i.values[0] === `only_${message.id}`) {
                if(db.hasOwnProperty('only')) {
                    const currentStatus = db.only;
                    const newStatus =!currentStatus;
                    db.only = newStatus;
                    client.data2.set(`soutien_${message.guild.id}`, db);
                    const status = db?.only === true? "Les status doivent a present contenir a present que le message de soutien" : "Les status contenant a present autre chose que le message de soutien seront pris en compte";
                    i.reply({ content: status, ephemeral: true });
                    setTimeout(async () => {
                        await reply.delete();
                    }, 2000);
                    await updateEmbed();
                    } else {
                        i.reply({ embeds: [], components: [], content: "Impossible de mettre en place le systeme", ephemeral: true });
                }
              }
          })
  
          client.on('interactionCreate', async (i) => {
              if (message.author.id === i.user.id) {
                  const db = client.data2.get(`soutien_${message.guild.id}`)
                  if (i.customId === `soutien_reset_${message.id}`) {
                      client.data2.delete(`soutien_${message.guild.id}`)
                      i.reply({ embeds: [], content: "`✅` les paramètres ont était bien reset", ephemeral: true })
                      await updateEmbed()
  
                  }
                  if (i.customId === `soutien_setup_role_${message.id}`) {
                      const rolee = i.values;
                      if (db.hasOwnProperty('role')) {
                          db.role = rolee
                          client.data2.set(`soutien_${message.guild.id}`, db);
                      } else {
                          client.data2.set(`soutien_${message.guild.id}`, db);
                      }
                      await updateEmbed()
                      i.message.delete()
                  }
                  if (i.customId === `soutien_setup_blacklist_${message.id}`) {
                    const rolee = i.values;
                    if (db.hasOwnProperty('blacklist')) {
                        db.blacklist = rolee
                        client.data2.set(`soutien_${message.guild.id}`, db);
                    } else {
                        client.data2.set(`soutien_${message.guild.id}`, db);
                    }
                    await updateEmbed()
                    i.message.delete()
                  }
              }
              if (i.customId === `soutien_setup_addstatus_${message.id}`) {
                let question = await i.reply({content: 'Quel status souhaitez vous ajouter'});
                const filter = m => m.author.id === i.user.id && m.channel.id === i.channel.id;
                const collector = i.channel.createMessageCollector({ filter, time: ms("2m") });
                collector.on('collect', async (m) => {
                    const db = client.data2.get(`soutien_${message.guild.id}`) || {
                        name: [],
                        role: [],
                        blacklist: [],
                        only: false,
                        allowed: false,
                        status: false
                    };
                    db.name.push(m.content);
                    client.data2.set(`soutien_${message.guild.id}`, db);
                    await question.delete();
                    await m.reply({ content: "Le status a bien été ajouté", ephemeral: true });
                    await updateEmbed();
                    i.message.delete();
                    collector.stop();
                });
             }
             if (i.customId === `soutien_setup_delstatus_${message.id}`) {
                let question = await i.reply({content: 'Quel status souhaitez vous supprimer'});
                const filter = m => m.author.id === i.user.id && m.channel.id === i.channel.id;
                const collector = i.channel.createMessageCollector({ filter, time: ms("2m") });
                collector.on('collect', async (m) => {
                    const db = client.data2.get(`soutien_${message.guild.id}`) || {
                        name: [],
                        role: [],
                        blacklist: [],
                        only: false,
                        allowed: false,
                        status: false
                    };
                    db.name.splice(db.name.indexOf(m.content), 1);
                    client.data2.set(`soutien_${message.guild.id}`, db);
                    await question.delete();
                    await m.reply({ content: "Le status a bien été supprimé", ephemeral: true });
                    await updateEmbed();
                    i.message.delete();
                    collector.stop();
                });
             }
             
  
          })
      }
  }
  