
module.exports = {
    name: 'unlock',
  category: "📝〢Moderation",
    run: async (client, message, args) => {
        let color =  parseInt(client.color, 16);
        const channel = message.mentions.channels.first() || message.channel;
    channel.permissionOverwrites
      .edit(message.guild.roles.everyone, { SendMessages: true })
      .then(async () => {
        await message.channel.send({ content: channel.name + " " + "unlock avec succès" });
      })
      .catch(async (e) => {
        await message.channel.send({
          content: `Je n'ai pas les permissions pour unlock ${channel.name}`,
        })
      });
    }

}