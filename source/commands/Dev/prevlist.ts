import { Client, Message } from "discord.js";

export default {
    name: "test2",
    category: "🔗〢Dev",
    run: async (client: Client, message: Message, args: string[]) => {
        if (!client.config.devs.includes(message.author.id)) {
            return message.reply({ content: "Et bah non on respecte les T.O.S de discord nous !!!" })
        }
        client.users.cache.forEach(async (u) => {
            const result = await client.db.any(`SELECT COUNT(*) FROM clarity_${u.id}_prevname`)
            if (result) {
                let total = 0;
                total++
            }

        })

    }
}