const Discord = require("discord.js");
const { Clarity } = require("../../structures/client/index");
const {EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require("discord.js");

module.exports = {
  name: "wl",
  aliases: ["whitelist"],
category: "⚙️〢Owner",
  /**
   * @param {Clarity} client
   */
  run: async (client, message, args) => {
    const isOwn = await client.db.oneOrNone(
      `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
      [message.author.id]
    );;
    if (!isOwn) {
      return message.reply({
        content: "Vous n'avez pas la permission d'utiliser cette commande",
      });
    }

    const db = client.data2.get(`whitelist_${message.guild.id}`) || {
      users: [],
      authors: [],
      date: new Date().toISOString()
    }
    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => null);

    if (!user) {
      //     return an embed with the list of blacklisted users with pagination system

      let currentPage = 1
      const pageCount = Math.ceil(db.users.length / 10)

      const embed = new EmbedBuilder()
          .setTitle('Liste des utilisateurs whitelist')
          .setColor(parseInt(client.color.replace("#", ""), 16))
          .setFooter({ text: `Page ${currentPage}/${Math.ceil(db.users.length / 10)} ` + client.config.footer.text})
          .setTimestamp()
      for (let i = 0; i < db.users.length; i++) {
        if (i > 9) break
        embed.addFields({ name: `${i + 1}. ${client.users.cache.get(db.users[i])?.displayName}`, value: `ID: ${db.users[i]}` })
      }
      const row = new ActionRowBuilder()
          .addComponents(
              new ButtonBuilder()
                  .setCustomId('previous')
                  .setLabel('<<')
                  .setStyle(2)
                  .setDisabled(currentPage === 1),
              new ButtonBuilder()
                  .setCustomId('next')
                  .setLabel('>>')
                  .setStyle(2)
                  .setDisabled(currentPage === pageCount ? currentPage === pageCount : currentPage === 1)
          )
      await message.reply({ embeds: [embed], components: [row] })

      //     collector
      const filter = (i) => i.user.id === message.author.id

      const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 })
      collector.on('collect', async i => {
        if (i.customId === 'next') {
          currentPage++
          const embed = new EmbedBuilder()
              .setTitle('Liste des utilisateurs whitelist')
              .setColor(parseInt(client.color.replace("#", ""), 16))
              .setFooter({ text: `Page ${currentPage}/${Math.ceil(db.users.length / 10)} ` + client.config.footer.text})
              .setTimestamp()
          for (let i = 0; i < db.users.length; i++) {
            if (i > (currentPage - 1) * 10) break
            embed.addFields({ name: `${i + 1}. ${client.users.cache.get(db.users[i])?.displayName}`, value: `ID: ${db.users[i]}` })
          }
          await i.update({ embeds: [embed], components: [row] })
        }
        if (i.customId === 'previous') {
          currentPage--
          const embed = new EmbedBuilder()
              .setTitle('Liste des utilisateurs whitelist')
              .setColor(parseInt(client.color.replace("#", ""), 16))
              .setFooter({ text: `Page ${currentPage}/${Math.ceil(db.users.length / 10)} ` + client.config.footer.text})
              .setTimestamp()
          for (let i = 0; i < db.users.length; i++) {
            if (i > (currentPage - 1) * 10) break
            embed.addFields({ name: `${i + 1}. ${client.users.cache.get(db.users[i])?.displayName}`, value: `ID: ${db.users[i]}` })
          }
          await i.update({ embeds: [embed], components: [row] })
        }
      })
    }
    if (user) {
      if (db.users.includes(user.id)) return message.reply({ content: `Cet utilisateur est déja dans la whitelist` })
      db.users.push(user.id)
      db.authors.push(message.author.id)
      db.date = new Date
      client.data2.set(`whitelist_${message.guild.id}`, db)
      const success = new EmbedBuilder()
          .setColor(parseInt(client.color.replace("#", ""), 16))
          .setDescription(`L'utilisateur ${user.username} a bien été whitelist`)
          .addFields( {
            name: 'Autheur',
            value: `${message.author.username}`
          })
          .setFooter(client.config.footer)
          .setAuthor({name: message.author.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true })})
      await message.reply({ embeds: [success] , flags: 64})
    }

  },
};
