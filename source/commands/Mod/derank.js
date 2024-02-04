const Discord = require("discord.js")
module.exports = {
    name: "derank",
    description: "derank un user",
    aliases : [],
  category: "📝〢Moderation",
    run: async (client, message, args) => {
        let color = parseInt(client.color.replace("#", ""), 16);
        if (!message.member.permissions.has("Administrator")) return message.channel.send({ content: " Vous n'avez pas les permissions utiliser cette commande - [ADMINISTRATOR]" });
        let user = await client.users.cache.get(args[0]) || message.mentions.Members.first() 
        async function checkperm(user) {
            if (user.permissions.has("Administrator") || user.permissions.has("Manage_Guild") || user.permissions.has("Ban_Members") || user.permissions.has("Kick_Members") || 
            user.permissions.has("Manage_Roles") || user.permissions.has("View_Audit_Log") || user.permissions.has("Manage_Messages") || user.permissions.has("Manage_Nicknames") || user.permissions.has("Manage_Emojis") 
            || user.permissions.has("Manage_Webhooks") || user.permissions.has("Manage_Channels") || user.permissions.has("Manage_Nicknames") || user.permissions.has("Mention_Everyone") || user.permissions.has("Mute_Members") || user.permissions.has("Deafen_Members") || user.permissions("Move_Members")
            || user.permissions.has("Manage_Stickers")
            ) {
                return true
            } else {
                return false
            }
        }
        async function derank(x, y) {
            let guild = client.guilds.cache.get(x)
            let member = guild.Members.cache.get(y)
            let bot = guild.Members.cache.get(client.user.id)

            if (bot.roles.highest.position >= member.roles.highest.position) {
                member.roles.cache.forEach(async (role) => {
                    if (role.permissions.has("Administrator") || role.permissions.has("Manage_Guild") || role.permissions.has("Ban_Members") || role.permissions.has("Kick_Members") || role.permissions.has("Manage_Roles") || role.permissions.has("View_Audit_Log") || role.permissions.has("Manage_Messages")
                    || role.permissions.has("Manage_Nicknames") || role.permissions.has("Manage_Emojis") || role.permissions.has("Manage_Webhooks") || role.permissions.has("Manage_Channels") || role.permissions.has("Mention_Everyone") || role.permissions.has("Mute_Members") || 
                    role.permissions.has("Deafen_Members") || role.permissions.has("MOVE_Members") || role.permissions.has("Manage_Stickers") || role.permissions.has("Mute_Members")
                    
                    ) {
                        member.roles.remove(role.id).catch(async err => {})
                    }
                })
            }
        }
        if(args[0]) {
            let user = await client.users.cache.get(args[0]) || message.mentions.members.first()  
            if(!user) return message.channel.send({ content: `Aucun membre trouvée pour: \`${args[0]}\`` })
            if(user) {
                if (user.id === message.author.id) {
                    return message.channel.send({ content: `Vous n'avez pas la permission de **derank** <@${user.id}>` });
                  }
                  if(user.roles.highest.position > client.user.id) return message.channel.send({ content: `Je n'ai pas les permissions nécessaires pour **derank** <@${user.id}>` });
                  let own = await client.db.any(`
                 SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1
                `)
          // si own === user.id return message d erreur
          if(own.includes(user.id)) return message.channel.send({ content: `Vous n'avez pas la permission de **derank** <@${user.id}>` });
          let buy = await client.db.any(`
          SELECT 1 FROM clarity_${client.user.id}_buyers WHERE user_id = $1
          `)
          // si buy === user.id return message d erreur
          if(buy.includes(user.id)) return message.channel.send({ content: `Vous n'avez pas la permission de **derank** <@${user.id}>` });
          if (client.config.buyer.includes(user.id)) return message.channel.send({ content: `Vous n'avez pas la permission de **derank** <@${user.id}>` });
          checkperm(user)? derank(user.id, message.author.id) 
             : message.channel.send({ content: `${user} à été **derank**` });
            }
        }
    }
}