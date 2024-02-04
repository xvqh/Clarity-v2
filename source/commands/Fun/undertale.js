module.exports = {
    name: "undertale",
    aliases: ["undertale"],
    category: "Fun",
    description: "Sends Undertale text",
    usage: "undertale <text>",
    run: async (client, message, args) => {
        if (!args.length) return message.reply("Veuillez entrer du texte")
        const text = args.join(' ');
        message.channel.send({
            embeds: [{
                color: parseInt(client.color.replace("#", ""), 16),
                image: {
                    url: `https://www.demirramon.com/gen/undertale_text_box.png?text=${encodeURIComponent(text)}`
                },
                footer: {
                    text: client.config.footer.text
                }
            }]
        })
    }
}