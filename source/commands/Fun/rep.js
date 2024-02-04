const ms = require("parse-ms")
module.exports = {
    name: "rep",
    description: "Repost un message",
    category: "Fun",
    run: async(client, message, args) => {
        const user = message.mentions.users.first() || client.users.cache.get(args[0])
        let rep = args.slice(1).join(" ");
        let timeout = 43200000;
        if (client.data.get(`cooldown_${message.author.id}`) !== null && timeout - (Date.now() - client.data.get(`cooldown_${message.author.id}`)) > 0) {
            let time = ms(timeout - (Date.now() - client.data.get(`cooldown_${message.author.id}`)))
            message.reply({
                embeds: [{
                    author: {
                        name: message.author.username,
                        icon_url: message.author.displayAvatarURL({dynamic: true})
                    },
                    color: parseInt(client.color.replace("#", ""), 16),
                    description: `Veuillez patienter **${time.minutes} minutes et ${time.seconds} secondes** avant de refaire cette commande.`,
                    footer: client.config.footer
                }]
            })
        } else {
            if(!user) {
                return message.channel.send({
                    embeds: [{
                        author: {
                            name: message.author.username,
                            icon_url: message.author.displayAvatarURL({dynamic: true})
                        },
                        color: parseInt(client.color.replace("#", ""), 16),
                        description: "Veuillez preciser un utilisateur",
                        footer: client.config.footer
                    }]
                })
            }
            if(user.id === message.author.id) return message.channel.send({
                embeds: [{
                    author: {
                        name: message.author.username,
                        icon_url: message.author.displayAvatarURL({dynamic: true})
                    },
                    color: parseInt(client.color.replace("#", ""), 16),
                    description: "Vous ne pouvez pas vous ajouté des points de réputations vous même!",
                    footer: client.config.footer
                }]
            })
            client.data.set(`userrep_${user.id}`, 1)
            client.data.set(`cooldown_${message.author.id}`, Date.now())
            message.channel.send({
                embeds: [{
                    author: {
                        name: message.author.username,
                        icon_url: message.author.displayAvatarURL({dynamic: true})
                    },
                    color: parseInt(client.color.replace("#", ""), 16),
                    description: `1 point de réputation ajouté à ${user} !`,
                    footer: client.config.footer
                }]
            })

        }
    }
}