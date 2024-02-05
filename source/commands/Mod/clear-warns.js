export default {
  name: "clear-warns",
  description: "supprime les warns d 'un user",
  aliases: [],
  category: "📝〢Moderation",
  run: async (client, message, args) => {
    let color = parseInt(client.color.replace('#', ''), 16);
    const user = message.mentions.members.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => { })
    if (!user) return message.reply({ content: "Veuillez préciser l'utilisateur dont vous souhaitez voir les warns" })
    const warns = await client.db.any(`SELECT * FROM clarity_${client.user.id}_${message.guild.id}_warns WHERE user_id = $1`, [user.id])
    if (warns.length === 0) return message.reply({ content: `${user} ne possède pas de warn à supprimer` })
    await client.db.none(`DELETE FROM clarity_${client.user.id}_${message.guild.id}_warns WHERE user_id = $1`, [user.id])
    return message.reply({ content: `Les warns de ${user} ont tous été supprimés` })
  }
}