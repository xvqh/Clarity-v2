export default {
  name: "clear",
  aliases: ["purge"],
  category: "📝〢Moderation",
  run: async (client, message, args) => {
    if (!message.member.permissions.has('Manage_Messages')) {
      return message.channel.send({ content: "Vous n'avez pas les permissions pour utiliser cette commande - [MANAGE_MESSAGES]" });
    }
    if (!args[0]) return message.reply('Veuillez fournir un nombre entre \`1\` et \`100\` ou preciser un temps comme : 5m pour 5minutes.')
    if (args[0]) {
      if (args[0].endsWith('m')) {
        const minutes = Number(args[0].slice(0, -1));
        if (isNaN(minutes)) {
          return message.reply('Veuillez fournir un temps valide en minutes.');
        }

        const timeLimit = minutes * 60 * 1000; // Convert minutes to milliseconds
        const currentTime = Date.now();

        message.channel.messages.fetch({ limit: 100 }) // Fetch last 100 messages
          .then(messages => {
            const messagesToDelete = messages.filter(m => currentTime - m.createdTimestamp <= timeLimit);
            message.channel.bulkDelete(messagesToDelete)
              .then(deletedMessages => {
                message.channel.send(`Succès, ${deletedMessages.size} messages ont été supprimés. Ces messages avaient été envoyés il y a ${minutes} minutes ou moins.`);
              })
              .catch(console.error);
          })
          .catch(console.error);
      } else {

        const amount = parseInt(args[0]);
        try {
          const fetched = await message.channel.messages.fetch({ limit: amount });
          const messagesToDelete = fetched.filter(msg => Date.now() - msg.createdTimestamp < 1209600000);
          await message.channel.bulkDelete(messagesToDelete, true);

          const deletedCount = messagesToDelete.size;
          message.channel.send({ content: `J'ai supprimé ${deletedCount} message(s)` });
        } catch (e) {
          console.error('Erreur :', e);
        }
      }
    }
  }
}