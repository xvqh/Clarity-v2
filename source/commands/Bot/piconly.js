module.exports = {
    name: "piconly",
    description: "Ajoute/Retire un salon des PicOnly",
   category: "🤖〢Bot",
    run: async (client, message, args) => {
        if(!message.member.permissions.has("Administrator")) return message.channel.send("Tu n'as pas les permissions d'utiliser cette commande !");
        await client.db.none(`CREATE TABLE IF NOT EXISTS clarity_${message.guild.id}_piconly (
            channel_id VARCHAR(20)
        )`)
        let ss = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
        if (args[0] === "on") {
            const channel = message.channel;
            await client.db.none(`INSERT INTO clarity_${message.guild.id}_piconly (channel_id) VALUES ($1) ON CONFLICT (channel_id) DO NOTHING`, [channel.id])
            channel.send(`Le salon ${channel} sera maintenant utilisé en tant que channel PicOnly`)
        }
        else if (args[0] === "off") {
            const channel = message.channel;
            await client.db.none(`DELETE FROM clarity_${message.guild.id}_piconly WHERE channel_id = $1`, [channel.id])
            channel.send(`Le salon ${channel} ne sera plus utilisé en tant que channel PicOnly`)
        } else {
            if (ss) {
                await client.db.none(`UPDATE clarity_${message.guild.id}_piconly (channel_id) VALUES ($1) ON CONFLICT (channel_id) DO NOTHING`, [ss.id])
                message.channel.send(`Le salon ${ss} sera maintenant utilisé en tant que channel PicOnly`)
            }
        }
    }
}