module.exports = {
    name: "topbump",
    description: "Affiche le top bump",
  category: "🔨〢Gestion",
    run: async(client, message) => {
        let color = parseInt(client.color.replace('#', ''), 16);
        const topb = await client.db.manyOrNone(`
        SELECT user_id, bump_count
        FROM clarity_topbump
        WHERE guild_id = \$1
        ORDER BY bump_count DESC
        LIMIT 10
        `, [message.guild.id])
        if (topb.length === 0) {
            return message.reply({content: "Aucun bumper trouver dans ce serveur"})
        }
        const lb = topb.map((bumper, index) => {
            const user = message.guild.members.cache.get(bumper.user_id);
            const position = index + 1;
            return `${position}. ${user ? user.displayName : "Utilisateur inconnu"}: ${bumper.bump_count} bumps`;
        })
        return message.reply({embeds: [{
            title: `${message.guild.name} - Top Bump`,
            description: lb.join("\n"),
            color: color,
            footer: client.config.footer,
            timestamp: new Date(),
        }]})
    }
}