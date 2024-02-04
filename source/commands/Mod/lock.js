
module.exports = {
    name: 'lock',
  category: "📝〢Moderation",
    run: async (client, message, args) => {
        let color =  parseInt(client.color.replace("#", ""), 16);
        const channel = message.mentions.channels.first() || message.channel;
    channel.permissionOverwrites
      .edit(message.guild.roles.everyone, { SendMessages: false })
      .then(async () => {
        await message.channel.send({ content: channel.name + " " + "lock avec succès" });
      })
      .catch(async (e) => {
        await message.channel.send({
          content: `Je n'ai pas les permissions pour lock ${channel.name}`,
        })
      });
    }

}