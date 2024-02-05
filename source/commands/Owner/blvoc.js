import { EmbedBuilder, ActionRowBuilder, ButtonBuilder } from 'discord.js';

export default {
  name: 'blvoc',
  aliases: ['blacklistvoc'],
  category: "⚙️〢Owner",
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
    const db = client.data2.get(`blvoc_${message.guild.id}`) || {
      users: []
    }
    let user = message.mentions.members.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => null);

    if (!user) {
      // return an embed with all members blvoc with pagination system
      const embed = new EmbedBuilder()
        .setTitle('Liste des utilisateurs blvoc')
        .setColor(parseInt(client.color.replace("#", ""), 16))
        .setFooter({ text: `Page 1/${db.users.length ? Math.ceil(db.users.length / 10) : 0}` })

      let currentPage = 1
      let maxPage = db.users.length ? Math.ceil(db.users.length / 10) : 0

      if (!db.users.length) {
        return message.reply({ content: 'Aucun utilisateur n\'a été ajouté à la liste des interdits vocal' })
      }

      for (let i = (currentPage - 1) * 10; i < currentPage * 10; i++) {
        if (!db.users[i]) break
        let user = await client.users.fetch(db.users[i]);
        embed.addFields({ name: `Utilisateur n°${i + 1}`, value: `${user} (${user.id})` })
      }

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('previousPage')
            .setLabel('<<')
            .setStyle(2)
            .setDisabled(currentPage === 1),
          new ButtonBuilder()
            .setCustomId('nextPage')
            .setLabel('>>')
            .setStyle(2)
            .setDisabled(currentPage === maxPage)
        )

      await message.reply({ embeds: [embed], components: [row] })

      const filter = (i) => i.user.id === message.author.id

      const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 })

      collector.on('collect', async (i) => {
        if (i.customId === 'nextPage') {
          if (currentPage === maxPage) return
          currentPage++
          const embed = await new EmbedBuilder()
            .setTitle('Liste des utilisateurs blvoc')
            .setColor(parseInt(client.color.replace("#", ""), 16))
            .setFooter({ text: `Page ${currentPage}/${maxPage}` })

          for (let i = (currentPage - 1) * 10; i < currentPage * 10; i++) {
            if (!db.users[i]) break
            let user = await client.users.fetch(db.users[i]);
            embed.addFields({ name: `Utilisateur n°${i + 1}`, value: `${user} (${user.id})` })
          }
          await i.update({ embeds: [embed], components: [row] })
        }
        else if (i.customId === 'previousPage') {
          if (currentPage === 1) return
          currentPage--
          const embed = await new EmbedBuilder()
            .setTitle('Liste des utilisateurs blvoc')
            .setColor(parseInt(client.color.replace("#", ""), 16))
            .setFooter({ text: `Page ${currentPage}/${maxPage}` })

          for (let i = (currentPage - 1) * 10; i < currentPage * 10; i++) {
            if (!db.users[i]) break
            let user = await client.users.fetch(db.users[i]);
            embed.addFields({ name: `Utilisateur n°${i + 1}`, value: `${user} (${user.id})` })
          }
          await i.update({ embeds: [embed], components: [row] })
        }
      })
    }

    //   si l utilisateur est deja bl
    if (db.users.includes(user.id)) {
      return message.reply({ content: `L'utilisateur <@${user.id}> est déjà dans la liste des interdits vocal` })
    }

    // sinon ajoute l utilisateur a la liste des blvoc
    db.users.push(user.id)
    client.data2.set(`blvoc_${message.guild.id}`, db)

    return message.reply({ content: `L'utilisateur <@${user.id}> a été ajouté à la liste des interdits vocal` })

  }
}