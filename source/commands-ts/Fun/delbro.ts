import { Client, Message } from "discord.js";

export default {
    name: "delbro",
    category: "Fun",
    aliases: ["delbro"],
    description: "Delete the last 100 messages",
    run: async (client: Client, message: Message, args: string[]) => {
        let db = client.data.get(`family_${message.author.id}`) || {
            brosis: [],
            children: [],
            parent: [],
            marry: null,
          };
         
          // Reset the brosis array
          db.brosis = [];
         
          // Save the updated data
          client.data.set(`family_${message.author.id}`, db);
         
          message.reply("Tous les frere/soeur ont été supprimés.");
    }
}