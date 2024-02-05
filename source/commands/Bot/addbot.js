export default {
    name: "addbot",
    aliases: [],
   category: "🤖〢Bot",
    run: async(client, message, args) => {
        const isBuy = await client.functions.isBuy(client, message.author.id);

        if (!isBuy) {
          return message.reply({
            content: "Vous n'avez pas la permission d'utiliser cette commande.",
          });
        }
        const isOwn = await client.db.oneOrNone(
          `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
          [message.author.id]
        );
    
        if (!isOwn) {
          return message.reply({
            content: "Vous n'avez pas la permission d'utiliser cette commande.",
          });
        }
        message.channel.send({
            embeds: [{
                description: `[\`Invite Moi\`](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8)`,
                color: parseInt(client.color.replace("#", ""), 16),
                footer: client.config.footer,
                timestamp: new Date()
            }]
        })
    }
}