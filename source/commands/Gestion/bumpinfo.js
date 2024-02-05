export default {
    name: "bumpinfo",
    description: "Affiche les informations du bump",
    category: "🔨〢Gestion",
    run: async (client, message) => {
        let color = parseInt(client.color.replace('#', ''), 16);
        let b = await client.db.any(`SELECT * from clarity_bump WHERE guild_id = $1`, [message.guild.id])
        console.log(b)
        if (b.length === 0) return message.reply({ content: "Le serveur n'a pas le système de bump de config" })
        const bump = await Promise.all(b.map(async (bump) => {
            const description = bump.description
            return `Description: ${description ? description : "Aucune description"}`
        }))
        const bumpD = bump.join('\n')
        let msg = await message.channel.send({
            embeds: [{
                color: color,
                title: message.guild.name,
                description: bumpD,
                footer: client.config.footer
            }]
        })
    }
}