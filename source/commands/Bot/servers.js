const Discord = require('discord.js')
module.exports = {
    name: 'servers',
    description: 'Liste des serveurs',
    aliases: ['server'],
    category: "🤖〢Bot",
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
        let msg = await message.channel.send({content: "Recherche..."});
        let color = parseInt(client.color.replace('#', ''), 16);
        let list = '';
        client.guilds.cache.forEach((g) => {
            list += `• ${g.name} (${g.id}) 〢 ${g.memberCount} membres 〢 Owner : ${g.ownerId} 〢 Niveau de verification : ${g.verificationLevel} 〢 Cree le : ${g.createdAt} 〢 Pp du serveur : ${g.iconURL({dynamic: true})} 〢 Banniere du serveur : ${g.bannerURL({dynamic: true})}〢 Vanity URL : https://discord.gg/${g.vanityURLCode}〢 Nombre de Boosts : ${g.premiumSubscriptionCount}〢 Nombres D'emoji : ${g.emojis.cache.size}〢 Nombre de roles : ${g.roles.cache.size} 〢 Nombre de channels : ${g.channels.cache.size} 〢 Nombre de stickers : ${g.stickers.cache.size} \n`;
        })
        const out = new Discord.AttachmentBuilder(Buffer.from(list), {name: 'servers.txt'});
        msg.edit({
            content: "Liste des serveurs",
            files: [out]
        })
    }
}

