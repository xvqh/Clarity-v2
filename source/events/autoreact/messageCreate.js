export default {
    name: 'messageCreate',
    run: async (client, message) => {
        if (message.author.bot) return;
        if (!message.guild) return; 
        let autoreact = client.data2.get(`autoreact_${message.guild.id}`, {
            channel: [],
            emoji: []
        })
        if (!autoreact) return;
        if (autoreact.channel.includes(message.channel.id)) {
            message.react(autoreact.emoji[Math.floor(Math.random() * autoreact.emoji.length)])
        }
    }
}