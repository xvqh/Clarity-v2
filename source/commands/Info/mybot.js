export default {
    name: "mybot",
    description: "Liste de tes bots que tu possede chez clarity",
    category: "💻〢Informations",
    aliases: ["mybots"],
    run: async (client, message) => {
        const bots = await client.db.any(`SELECT * FROM clarity_${message.author.id}_mybots`);
        if (!bots) return message.reply({ conten: "Vous ne possèdez aucun bot custom" })
        const botDescriptions = await Promise.all(bots.map(async (bot, i) => {
            const botUser = await client.users.fetch(bot.bot_id);
            return `[${i + 1}] [${botUser.username}](https://discord.com/api/oauth2/authorize?client_id=${bot.bot_id}&permissions=8&scope=bot%20applications.commands) : ${`<t:${Math.round(new Date(bot.time).getTime() / 1000)}:R>` ? `<t:${Math.round(new Date(bot.time).getTime() / 1000)}:R>` : "Expiré"}`;
        }));

        let msg = await message.channel.send({
            embeds: [{
                title: "Mes bots",
                description: botDescriptions.join("\n"),
                color: parseInt(client.color.replace("#", ""), 16),
                footer: client.config.footer,
                timestamp: new Date()
            }]
        });



    }
}