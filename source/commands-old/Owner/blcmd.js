import Clarity from "../../structures/client/index.js";

export default {
    name: "blacklistcmd",
    aliases: ["blcmd"],

    category: "⚙️〢Owner",
    run: async (client, message, args) => {
        const isOwn = await client.db.oneOrNone(
            `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
            [message.author.id]
        );
        if (!isOwn) {
            return message.reply({
                content: "Vous n'avez pas la permission d'utiliser cette commande",
            });
        }
        const data = await client.data.get(`blcmd_${message.guild.id}`) || {
            users: []
        }

        const user = message.mentions.members.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => { })

        if (!user) {
            let blUsers = data.users.map(async (blacklist) => `[${(await client.users.fetch(blacklist.user_id)).tag}](https://discord.com/users/${blacklist.user_id})`);
            if (blUsers.length === 0) {
                return message.reply({
                    content: "Aucun utilisateur n'est blcmd",
                });
            }
            return message.reply({
                embeds: [{
                    title: "Liste des utilisateurs bloqués",
                    description: blUsers.join("\n"),
                    color: parseInt(client.color.replace("#", ""), 16),
                    footer: { text: client.config.footer.text },
                    timestamp: new Date(),
                    thumbnail: { url: client.user.displayAvatarURL({ dynamic: true }) },
                    author: {
                        name: message.author.tag,
                        icon_url: message.author.displayAvatarURL({ dynamic: true }),
                    }
                }]
            });
        }

        const buyerID = client.config.buyer;
        if (user.id === message.author.id) {
            return message.reply({ content: `${user} vous ne pouvez pas vous auto blcmd.` });
        }
        if (user.id === buyerID) {
            return message.reply({ content: `${user} est le proprietaire du bot et ne peut pas etre blcmd.` });
        }
        if (user.id === client.user.id) {
            return message.reply({ content: `${user} vous ne pouvez pas blcmd ce bot.` });
        }

        if (data.users.some((bl) => bl.user_id === user.id)) {
            return message.reply({
                content: `${user} est déjà blcmd`,
            });
        }

        data.users.push({
            user_id: user.id,
            date: Date.now()
        });
        await client.data.set(`blcmd_${message.guild.id}`, data);
        return message.reply({
            content: `${user} a été blcmd`,
        });



    },
};

