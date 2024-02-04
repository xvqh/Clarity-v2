module.exports = {
    name: 'warn',
  category: "📝〢Moderation",
    run: async (client, message, args) => {
        let color =  parseInt(client.color.replace("#", ""), 16);
        await client.db.none(`CREATE TABLE IF NOT EXISTS clarity_${client.user.id}_${message.guild.id}_warns (
            warn_id VARCHAR(20) PRIMARY KEY,
            user_id VARCHAR(20) UNIQUE,
            reason TEXT,
            author_id VARCHAR(20)
        )`)
        let member =  message.mentions.members.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(()=> {})
        if (!member) return message.reply({content: "Veuillez précisé un membre"})
        await client.db.none(`
        INSERT INTO clarity_${client.user.id}_${message.guild.id}_warns (warn_id, user_id, reason, author_id) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id) DO NOTHING
        `, [message.id, member.id, args.slice(1).join(" "), message.author.id])
        return message.reply({content: `${member} a bien été warn pour la raison : ${args.slice(1).join(" ")}`})
    }
}