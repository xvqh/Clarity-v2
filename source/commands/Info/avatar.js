import Discord from "discord.js";
import Clarity from "../../structures/client/index.js";

export default {
    name: 'avatar', 
   category: "💻〢Informations",
    aliases: [],
    /**
     * 
     * @param {Clarity} client 
     * @param {Discord.Message} message
     */
    run: async (client, message, args) => {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
     let color =  parseInt(client.color.replace("#", ""), 16);
      message.channel.send({
         embeds: [{
             color: color,
             title: `${member.user.username}`,
             image: { url : member.displayAvatarURL({dynamic: true}) },
         }
         ]
     })
    

    }
}


