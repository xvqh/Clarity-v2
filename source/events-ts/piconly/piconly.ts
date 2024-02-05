import { Client, Message } from "discord.js";

export default {
    name: 'messageCreate',
    run: async (client: Client, message: Message) => {
        if (message.author.bot) return;
        if (message.channel.type !== 0) return;

        if (!message.guild || message.member && message.member.permissions.has('Administrator')) return;
        
        let db = await client.data2.get(`${message.guild.id}.piconly`) || {
            channel: []
        };

        if (!db.channel.includes(message.channel.id)) return;

        if (db.channel.includes(message.channel.id) && message.attachments.size <= 0) {
            return message.delete().catch(() => {
            });
        } else {
            return;
        }
    }
}