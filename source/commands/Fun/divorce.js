export default {
    name: 'divorce',
    run: async(client, message, args) => {
        const user =
        message.mentions.users.first() || client.users.cache.get(args[0]);
        if (!user) {
            return message.reply(
                "vous devez mentionner la personne avec laquelle vous voulez divorcer."
            );
        }
        if (user.bot) {
            return message.reply("vous ne pouvez pas vous divorcer avec un bot.");
        }
        let db = client.data.get(`family_${message.author.id}`) || {
            sister: [],
            brother: [],
            children: [],
            parent: [],
            marry: null,
        };

    // check if the user and the author are maried
    if (!db.marry) {
        return message.reply(
            "vous n'etes pas marier."
        );
    }

    // if the user and the message author are maried reset the db
if (db.marry === user.id) {
        client.data.set(`family_${message.author.id}`, {
            sister: [],
            brother: [],
            children: [],
            parent: [],
            marry: null,
        });
        client.data.set(`family_${user.id}`, {
            sister: [],
            brother: [],
            children: [],
            parent: [],
            marry: null,
        });
        await user.send({
            embeds: [{
                color: 3447003,
                title: "Divorce",
                description: message.author.username + ' Vient de divorcer avec vous',
                footer: {
                    text: "Divorce",
                },
            }],
        })
        return message.reply(
            "vous avez bien divorcer."
        );
    }

    // if
    }
}