module.exports = {
    name: 'nocmd',
    run: async(client, message, args) => {
        if (client.config.devs?.includes(message.author.id)) {
            let ss = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
            if (args[0] === "on") {
                const channel = message.channel;
                let db = await client.data2.get(`nocmd_${message.guild.id}`) || {
                    channels: []
                }
                db.channels.push(channel.id)
                await client.data2.set(`nocmd_${message.guild.id}`,db)
                channel.send(`Commandes interdites dans le salon ${channel}`)
            }
            else if (args[0] === "off") {
                const channel = message.channel;
                let db = await client.data2.get(`nocmd_${message.guild.id}`) || {
                    channels: []
                }
                db.channels.splice(db.channels.indexOf(channel.id), 1)
                await client.data2.set(`nocmd_${message.guild.id}`,db)
                channel.send(`Commandes autorisées dans le salon ${channel}`)
            } else {
                if(ss) {
                    let db = await client.data2.get(`nocmd_${message.guild.id}`) || {
                        channels: []
                    }
                    if(db.channels.includes(ss.id)) {
                        db.channels.splice(db.channels.indexOf(ss.id), 1)
                        await client.data2.set(`nocmd_${message.guild.id}`,db)
                        message.channel.send(`Commandes autorisées dans le salon ${ss}`)
                    } else {
                        db.channels.push(ss.id)
                        await client.data2.set(`nocmd_${message.guild.id}`,db)
                        message.channel.send(`Commandes interdites dans le salon ${ss}`)
                    }
                }
            }
        } else {
            const isOwn = await client.db.oneOrNone(
                `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
                [message.author.id]
            );
            if (!isOwn) {
                return message.reply({
                   content: "Vous n'avez pas la permission d'utiliser cette commande",
                });
            }
            let ss = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
            if (args[0] === "on") {
                const channel = message.channel;
                let db = await client.data2.get(`nocmd_${message.guild.id}`) || {
                    channels: []
                }
                db.channels.push(channel.id)
                await client.data2.set(`nocmd_${message.guild.id}`,db)
                channel.send(`Commandes interdites dans le salon ${channel}`)
            }
            else if (args[0] === "off") {
                const channel = message.channel;
                let db = await client.data2.get(`nocmd_${message.guild.id}`) || {
                    channels: []
                }
                db.channels.splice(db.channels.indexOf(channel.id), 1)
                await client.data2.set(`nocmd_${message.guild.id}`,db)
                channel.send(`Commandes autorisées dans le salon ${channel}`)
            } else {
                if(ss) {
                    let db = await client.data2.get(`nocmd_${message.guild.id}`) || {
                        channels: []
                    }
                    if(db.channels.includes(ss.id)) {
                        db.channels.splice(db.channels.indexOf(ss.id), 1)
                        await client.data2.set(`nocmd_${message.guild.id}`,db)
                        message.channel.send(`Commandes autorisées dans le salon ${ss}`)
                    } else {
                        db.channels.push(ss.id)
                        await client.data2.set(`nocmd_${message.guild.id}`,db)
                        message.channel.send(`Commandes interdites dans le salon ${ss}`)
                    }
                }
            }
        }
    }
}