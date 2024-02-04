module.exports = {
    name: 'autoreact',
    run: async(client, message, args) => {
        if (client.config.devs.includes(message.author.id)) {
            if (!args[0]) {
                return message.reply({
                   content: 'Veuillez precisez: add / remove / list'
                })
            }
            if (args[0] === 'add') {
                let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) 
                if (!channel) return message.channel.send("Veuillez spécifier un salon!")
                let emoji = args[2]
                if (!emoji) return message.channel.send("Veuillez spécifier un emoji!")
 
                let autoreact = client.data2.get(`autoreact_${message.guild.id}`, {
                   channel: [],
                   emoji: []
                })
 
                if (!autoreact) {
                   autoreact = { channel: [], emoji: [] };
                }
 
                autoreact.channel.push(channel.id)
                autoreact.emoji.push(emoji)
                client.data2.set(`autoreact_${message.guild.id}`, autoreact)
                
                message.channel.send({
                   content: `L'emoji ${emoji} a été ajouté à l'autoreact dans le channel : ${channel}`
                })
            }
 
            if (args[0] === "del") {
                let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) 
                if (!channel) return message.channel.send("Veuillez spécifier un salon!")
                let emoji = args[2]
                if (!emoji) return message.channel.send("Veuillez spécifier un emoji!")
                let autoreact = client.data2.get(`autoreact_${message.guild.id}`, {
                   channel: [],
                   emoji: []
                })
 
                if (!autoreact) {
                   autoreact = { channel: [], emoji: [] };
                }
 
                autoreact.channel.splice(autoreact.channel.indexOf(channel.id), 1)
                autoreact.emoji.splice(autoreact.emoji.indexOf(emoji), 1)
                client.data2.set(`autoreact_${message.guild.id}`, autoreact)
                message.channel.send({
                   content: `L'emoji ${emoji} a été supprimé de l'autoreact dans le channel : ${channel}`
                })
            }

                        if (args[0] === "list") {
                let autoreact = client.data2.get(`autoreact_${message.guild.id}`, {
                   channel: [],
                   emoji: []
                })
                if (!autoreact) {
                   autoreact = { channel: [], emoji: [] };
                }
                for(let i =0; i< autoreact.channel.length; i++) {
                    message.channel.send({
                        embeds: [{
                            title: `Liste des autoreact `,
                            description: `**${autoreact.emoji[i]}** dans le channel : ${message.guild.channels.cache.get(autoreact.channel[i])}\n`,
                            color: parseInt(client.color.replace("#", ""), 16),
                            footer: client.config.footer
                        }]
                    })
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
            if (!args[0]) {
                return message.reply({
                   content: 'Veuillez precisez: add / remove / list'
                })
            }
            if (args[0] === 'add') {
                let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) 
                if (!channel) return message.channel.send("Veuillez spécifier un salon!")
                let emoji = args[2]
                if (!emoji) return message.channel.send("Veuillez spécifier un emoji!")
 
                let autoreact = client.data2.get(`autoreact_${message.guild.id}`, {
                   channel: [],
                   emoji: []
                })
 
                if (!autoreact) {
                   autoreact = { channel: [], emoji: [] };
                }
 
                autoreact.channel.push(channel.id)
                autoreact.emoji.push(emoji)
                client.data2.set(`autoreact_${message.guild.id}`, autoreact)
                
                message.channel.send({
                   content: `L'emoji ${emoji} a été ajouté à l'autoreact dans le channel : ${channel}`
                })
            }
 
            if (args[0] === "del") {
                let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) 
                if (!channel) return message.channel.send("Veuillez spécifier un salon!")
                let emoji = args[2]
                if (!emoji) return message.channel.send("Veuillez spécifier un emoji!")
                let autoreact = client.data2.get(`autoreact_${message.guild.id}`, {
                   channel: [],
                   emoji: []
                })
 
                if (!autoreact) {
                   autoreact = { channel: [], emoji: [] };
                }
 
                autoreact.channel.splice(autoreact.channel.indexOf(channel.id), 1)
                autoreact.emoji.splice(autoreact.emoji.indexOf(emoji), 1)
                client.data2.set(`autoreact_${message.guild.id}`, autoreact)
                message.channel.send({
                   content: `L'emoji ${emoji} a été supprimé de l'autoreact dans le channel : ${channel}`
                })
            }
        }
    }
 }
 