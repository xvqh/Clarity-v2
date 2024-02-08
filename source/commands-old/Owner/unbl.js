import { EmbedBuilder, ActionRowBuilder, ButtonBuilder } from 'discord.js';

export default {
    name: 'unbl',
    aliases: ['unblacklist'],
    run: async (client, message, args) => {
        const isBuy = await client.functions.isBuy(client, message.author.id);
        if (!isBuy) {
            return message.reply({
                content: "Vous n'avez pas la permission d'utiliser cette commande",
            });
        }
        const db = client.data2.get(`blacklist_${client.user.id}`) || {
            users: [],
            authors: [],
            date: null,
            reason: null
        }


        let user = message.mentions.users.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => null);

        if (!user) {
            return message.reply({
                content: "Veuillez mentionner un utilisateur à débloquer.",
            });
        }

        const userIndex = db.users.indexOf(user.id);
        if (userIndex === -1) {
            return message.reply({
                content: `**${user.tag}** n'est pas sur la liste noire.`,
            });
        }

        // Remove user from blacklist
        db.users.splice(userIndex, 1);
        db.authors.splice(userIndex, 1);
        client.data2.set(`blacklist_${client.user.id}`, db);

        const success = new EmbedBuilder()
            .setColor(parseInt(client.color.replace("#", ""), 16))
            .setDescription(`L'utilisateur ${user.username} a bien été supprimé de la liste noire.\nUnban de **${client.guilds.cache.size}** serveur(s).`)
            .setFooter(client.config.footer)
            .setAuthor({ name: message.author.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        // get all guilds
        const guilds = client.guilds.cache.map(guild => guild.name);
        // unban the members from all guilds
        for (const guildName of guilds) {
            const guild = client.guilds.cache.find(guild => guild.name === guildName);
            //  unban the member
            guild.members.unban(user.id);
        }
        await message.reply({ embeds: [success], flags: 64 })
    }
}
