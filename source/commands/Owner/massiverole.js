export default {
  name: "massiverole",
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

    let msg = await message.channel.send({ content: 'chargement du module en cours . . .' })
    await update(client, message, msg)
  }
}
async function update(client, message, msg) {
  const db = client.data.get(`massiverolera_${message.guild.id}`)
  if (!db) return;
  let memb = message.guild.members.cache.filter(m => m.roles.cache.has(db)).length
  let color = parseInt(client.color.replace('#', ''), 16);
  msg.edit({
    content: null,
    embeds: [
      {
        title: `${message.guild.name} massive Role`,
        description: `Il y a ${memb} membres avec un role`,
        color: color
      }
    ]
  })

}