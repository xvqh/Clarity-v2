const Discord = require("discord.js")
module.exports = {
    name: "ban",
  category: "📝〢Moderation",
    run: async (client, message, args) => {
        if (!message.member.permissions.has("Ban_Members")) {
            return message.channel.send("Tu n'as pas les permissions d'utiliser cette commande !");
        }
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!user) return  message.channel.send({ content: `Aucun membre trouvée pour: \`${args[0]}\`` })
        if(user){
        if (user.id === message.author.id) return message.channel.send({ content: `Vous ne pouvez pas vous auto-ban` });
        let antibanr = await client.db.any(`
        SELECT antibanrole FROM clarity_${client.user.id}_${message.guild.id}_settings
        `)
        if(user.roles.cache.has(antibanr)) return message.channel.send({ content: `Vous n'avez pas la permission de **ban** <@${user.id}>` })
          if(user.roles.highest.position > message.member.roles.highest.position) return message.channel.send({ content: `Vous n'avez pas les permissions nécessaires pour **ban** <@${user.id}>` });
          let own = await client.db.any(`
          SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1
          `)
          // si own === user.id return message d erreur
          if(own.includes(user.id)) return message.channel.send({ content: `Vous n'avez pas la permission de **ban** <@${user.id}>` });
          let buy = await client.db.any(`
          SELECT 1 FROM clarity_${client.user.id}_buyers WHERE user_id = $1
          `)
          // si buy === user.id return message d erreur
          if(buy.includes(user.id)) return message.channel.send({ content: `Vous n'avez pas la permission de **ban** <@${user.id}>` });
          if (client.config.buyer.includes(user.id)) return message.channel.send({ content: `Vous n'avez pas la permission de **ban** <@${user.id}>` });
          if (!user.bannable) return message.channel.send({content: `Je n'ai pas les permissions pour ban **${user.user.tag}**`})
          let reason = args.slice(1).join(" ") || "Aucune raison spécifiée"
          user.ban({reason: reason})
          .then(() => message.reply({ content: `**${user.user.tag}** a été ban pour la raison : \`${reason}\``}))
          .catch(() => message.reply({content: `Je n'ai pas les permissions pour ban **${user.user.tag}**`}))
        } else if (args[0]){
            await client.users.fetch(args[0]).then(async user => {
                const reason = args.splice(1).join(' ') || "Aucune raison fournie"
                try {
                    await message.guild.members.ban(user.id, {reason: reason }).then(() => {
                        message.channel.send({ content: `**${user.tag}** a été banni pour \`${reason}\`` })
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