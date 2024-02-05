import { Client, EmbedBuilder, Message } from "discord.js";

export default {
    name: "family",
    category: "Fun",
    aliases: ["fam"],
    description: "Get family",
    usage: "family",
    run: async (client: Client, message: Message, args: string[]) => {
        const user =
        message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
  
        // get the family of the user
        let db = client.data.get(`family_${user.id}`) || {
            brosis: [],
            children: [],
            parent: [],
            marry: null,
        };
  
        // convert IDs to usernames
        db.brosis = db.brosis ? db.brosis.map((id: any) => client.users.cache.get(id)?.username || id) : [];
        db.children = db.children ? db.children.map((id: any)  => client.users.cache.get(id)?.username || id) : [];
        db.parent = db.parent ? db.parent.map((id: any)  => client.users.cache.get(id)?.username || id) : [];
        db.marry = db.marry ? client.users.cache.get(db.marry)?.username || db.marry : null;

        const embed = new EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ forceStatic: false }) })
            .addFields([
                {
                    name: "Freres/Soeurs",
                    value: `${db.brosis.join(", ")? db.brosis.join(", ") : "Aucun frere"}`,
                    inline: true
                }, {
                    name: "Enfant",
                    value: `${db.brosis.join(", ")? db.children.join(", ") : "Aucun enfant"}`,
                    inline: true
                }, {
                    name: "Parent",
                    value: `${db.brosis.join(", ")? db.parent.join(", ") : "Aucun parent"}`,
                    inline: true
                }, {
                    name: "Marié",
                    value: `${db.marry || "Non marié"}`,
                    inline: true
                }
            ])
            .setColor(parseInt(client.color.replace("#", ""), 16))
            .setFooter({ text: client.config.footer });
    }
}