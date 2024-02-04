const Discord = require("discord.js")
module.exports = {
    name: "kick",
  category: "📝〢Moderation",
    run: async (client, message, args) => {
        if (!message.member.permissions.has("Kick_Members")) {
            return message.channel.send("Tu n'as pas les permissions d'utiliser cette commande !");
        }
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!user) return  message.channel.send({ content: `Aucun membre trouvée pour: \`${args[0]}\`` })
        if(user){
        if (user.id === message.author.id) return message.channel.send({ content: `Vous ne pouvez pas vous auto-kick` });
        let antikickr = await client.db.any(`
        SELECT antikickrole FROM clarity_${client.user.id}_${message.guild.id}_settings
        `)
        if(user.roles.cache.has(antikickr)) return message.channel.send({ content: `Vous n'avez pas la permission de **kick** <@${user.id}>` })
          if(user.roles.highest.position > message.member.roles.highest.position) return message.channel.send({ content: `Vous n'avez pas les permissions nécessaires pour **kick** <@${user.id}>` });
          let own = await client.db.any(`
          SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1
          `)
          // si own === user.id return message d erreur
          if(own.includes(user.id)) return message.channel.send({ content: `Vous n'avez pas la permission de **kick** <@${user.id}>` });
          let buy = await client.db.any(`
          SELECT 1 FROM clarity_${client.user.id}_buyers WHERE user_id = $1
          `)
          // si buy === user.id return message d erreur
          if(buy.includes(user.id)) return message.channel.send({ content: `Vous n'avez pas la permission de **kick** <@${user.id}>` });
          if (client.config.buyer.includes(user.id)) return message.channel.send({ content: `Vous n'avez pas la permission de **kick** <@${user.id}>` });
          if(user.id === client.user.id) {
            return message.channel.send({ content: `Je ne peux pas **kick** cet utilisateur` });
        }
          if (!user.kickable) return message.channel.send({content: `Je n'ai pas les permissions pour kick **${user.tag}**`})
          let reason = args.slice(1).join(" ") || "Aucune raison spécifiée"
          user.kick({reason: reason})
          .then(() => message.reply({ content: `**${user.user.tag}** a été kick pour la raison : \`${reason}\``}))
          .catch(() => message.reply({content: `Je n'ai pas les permissions pour kick **${user.tag}**`}))
        } else if (args[0]){
            await client.users.fetch(args[0]) .then(async user => {
                const reason = args.splice(1).join(' ') || "Aucune raison fournie"
                try {
                    await message.guild.members.kick(user.id, {reason: reason }).then(() => {
                        message.channel.send({ content: `**${user.tag}** a été kickni pour \`${reason}\`` })
                    })
                } catch (error) {
                    null
                }
            })
            .catch(err => {return message.channel.send({ content: ' Cet utilisateur n\'est pas valide.'})
        })
        }
    }
}