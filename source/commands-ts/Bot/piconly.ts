import { Client, Message } from "discord.js";

export default {
    name: "piconly",
    description: "Ajoute/Retire un salon des PicOnly",
   category: "🤖〢Bot",
    run: async (client: Client, message: Message, args: string[]) => {
        if(!message.guild || client.user) return;
        if(!message.member?.permissions.has("Administrator")) return message.channel.send("Tu n'as pas les permissions d'utiliser cette commande !");
        let ss = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
        if (args[0] === "on") {
            const channel = message.channel;
            let db = await client.data2.get(`${message.guild.id}.piconly`) || {
                channel: []
            }
            db.channel.push(channel.id)
            await client.data2.set(`${message.guild.id}.piconly`,db)
            channel.send(`Le salon ${channel} sera maintenant utilisé en tant que channel PicOnly`)
        }
        else if (args[0] === "off") {
            const channel = message.channel;
            let db = await client.data2.get(`${message.guild.id}.piconly`) || {
                channel: []
            }
            db.channel.splice(db.channel.indexOf(channel.id), 1)
            await client.data2.set(`${message.guild.id}.piconly`,db)
            channel.send(`Le salon ${channel} sera maintenant utilisé en tant que channel normal`)
        } else {
            if(ss) {
                let db = await client.data2.get(`${message.guild.id}.piconly`) || {
                    channel: []
                }
                if(db.channel.includes(ss.id)) {
                    db.channel.splice(db.channel.indexOf(ss.id), 1)
                    await client.data2.set(`${message.guild.id}.piconly`,db)
                    message.channel.send(`Le salon ${ss} sera maintenant utilisé en tant que channel normal`)
                } else {
                    db.channel.push(ss.id)
                    await client.data2.set(`${message.guild.id}.piconly`,db)
                    message.channel.send(`Le salon ${ss} sera maintenant utilisé en tant que channel PicOnly`)
                }
            }
        }
    }
}