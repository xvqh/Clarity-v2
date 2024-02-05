import { Client, Message } from "discord.js";

export default {
    name: 'messageCreate',
    run: async (client: Client, message: Message) => {
        if (message.author.bot) return;
        if (!message.guild) return;

        let autoreact = await client.data2.get(`autoreact_${message.guild.id}`);

        if (!autoreact) return;
        if (autoreact.channel.includes(message.channel.id)) {
            message.react(autoreact.emoji[Math.floor(Math.random() * autoreact.emoji.length)]);
        }
    }
}