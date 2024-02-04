const { EmbedBuilder , ActionRowBuilder, ButtonBuilder } = require('discord.js');
module.exports = {
  name: 'unblvoc',
  aliases: ['unblacklistvoc'],
  category: "⚙️〢Owner",
  run: async(client , message, args) => {
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
      return message.reply({
        content: "Veuillez mentionner un utilisateur à retirer de la liste des interdits vocal.",
      });
    }

    const userIndex = db.users.indexOf(user.id);
    if (userIndex === -1) {
      return message.reply({
        content: `**${user.tag}** n'est pas sur la liste des interdits vocal.`,
      });
    }

    // Remove user from blvoc
    db.users.splice(userIndex, 1);
    client.data2.set(`blvoc_${message.guild.id}`, db);

    const success = new EmbedBuilder()
        .setColor(parseInt(client.color.replace("#", ""), 16))
        .setDescription(`L'utilisateur ${user} a bien été retiré de la liste des interdits vocal.`)
        .setFooter(client.config.footer)
        .setAuthor({name: message.author.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true })})
    await message.reply({ embeds: [success] , flags: 64})
  }
}
