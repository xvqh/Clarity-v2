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
        let msg = await message.channel.send({ content: "Recherche..." });
        let color = parseInt(client.color.replace("#", ""), 16);
        let description =
        `**Nombre de serveurs :** \`${client.guilds.cache.size}\`\n\n` +
        client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((r) => r)
            .map((r, i) => `**${i + 1}** - ${r.name} \`[${r.memberCount}]\`・ \`(${r.id})\``)
            .slice(0, 10)
            .join("\n")

            msg.edit({
                content: null,
                embeds: [{
                    color: color,
                    title: `${client.user.username} - Liste des serveurs`,
                    description: description,
                    footer: client.config.footer,
                }]
            });      
    }
};

