export default {
  name: 'roll',
  category: 'fun',
  run: async (client, message) => {
    const roll = Math.floor(Math.random() * 6) + 1;
    message.channel.send({
      embeds: [{
        title: 'Roll',
        color: parseInt(client.color.replace("#", ""), 16),
        description: `Vous avez lancé le dé et obtenu : **${roll}**`
      }]
    });
  },
};

