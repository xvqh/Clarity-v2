import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from 'discord.js';

export default {
    name: 'blacklistinfo',
    aliases: ['blinfo'],
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
        const db = client.data2.get(`blacklist_${message.guild.id}`) || {
            users: [],
            authors: [],
            date: new Date().toISOString(),
            reason: null
        }
        let user = client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => null);

        if (db.users.indexOf(user.id) === -1) {
            return message.reply({
                content: `**${user.tag}** n'est pas blacklist`,
            });
        } else {
            // get the user bl
            const userBl = await client.users.fetch(db.users[db.users.indexOf(user.id)]);
            // get the author
            const author = await client.users.fetch(db.authors[db.users.indexOf(user.id)]);
            const embed = new EmbedBuilder()
                .setTitle(`Blacklist de ${user.username}`)
                .addFields(
                    { name: 'Utilisateur', value: `Mention: ${userBl}\n Nom d'utilisateur: ${userBl.displayName}\n ID: ${userBl.id}\n Avatar: [Lien](https://cdn.discordapp.com/avatars/${userBl.id}/${userBl.avatar})`, inline: true },
                    { name: "Modérateur", value: `Mention: ${author}\n Nom d'utilisateur: ${author.displayName}\n ID: ${author.id}\n Raison: ${db.reason}\n Avatar: [Lien](https://cdn.discordapp.com/avatars/${author.id}/${author.avatar})`, inline: true },
                    { name: 'Date', value: `<t:${Math.floor(new Date(db.date).getTime() / 1000)}:R>` }

                )
                .setColor(parseInt(client.color.replace("#", ""), 16))
                .setFooter({ text: client.config.footer.text })
                .setTimestamp();

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(5)
                        .setLabel('Profil de l\'utilisateur')
                        .setURL(`https://discord.com/users/${userBl.id}`),
                    new ButtonBuilder()
                        .setStyle(5)
                        .setLabel('Profil du modérateur')
                        .setURL(`https://discord.com/users/${author.id}`)
                )


            message.reply({ embeds: [embed], components: [row] })
        }
    }
}
