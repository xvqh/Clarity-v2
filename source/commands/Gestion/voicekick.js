module.exports = {
    name: 'voicekick',
    aliases: ['vk'],
    run: async(client, message ,args) => {
        const isOwn = await client.db.oneOrNone(
            `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
            [message.author.id]
          );
          if (!isOwn) {
            return message.reply({
              content: "Vous n'avez pas la permission d'utiliser cette commande",
            });
          }
          let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
          if (!member) {
            return message.reply({
              content: "Veuillez mentionner un membre ou donner un id de membre",
            });
          }

          // kick the member of the voice
          await member.voice.disconnect();
          // send a success message
          message.reply({
            content: `${member} a été **voicekick**`,
          });
    }
}