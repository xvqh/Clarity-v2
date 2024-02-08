export default {
    name: "emoji",
    aliases: ["addemoji"],
    run: async (client, message, args, commandName) => {
        if (!args.length) {
            return message.channel.send({ content: "Veuillez spécifier l'émoji" });
        }

        const emojiRegex = /<a?:[a-zA-Z0-9_]+:(\d+)>/;
        const totalEmojis = args.length;
        let creeemojis = 0;

        const msg = await message.channel.send("Merci de bien patienter pendant la création des emojis...");

        for (const rawEmoji of args) {
            const emojiss = rawEmoji.match(emojiRegex);

            if (emojiss) {
                const emojiId = emojiss[1];
                const extension = rawEmoji.startsWith("<a:") ? ".gif" : ".png";
                const url = `https://cdn.discordapp.com/emojis/${emojiId + extension}`;

                message.guild.emojis.create({ attachment: url, name: emojiId })
                    .then((emoji) => {
                        creeemojis++;

                        if (creeemojis === totalEmojis) {
                            msg.edit({
                                content: `**${totalEmojis}** emojis créés avec succès!`
                            });
                        }
                    })
                    .catch((error) => {
                        msg.edit({ content: "Une erreur s'est produite" });
                        console.error(error);
                    });
            }
        }
    }
};
