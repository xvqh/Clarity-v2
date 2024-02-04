const Discord = require('discord.js');
const Clarity = require('../../structures/client/index');

module.exports = {
    name: 'pic', 
    aliases: ['avatar', 'pp'],
   category: "💻〢Informations",
    /**
     * 
     * @param {Clarity} client 
     * @param {Discord.Message} message
     */
    run: async (client, message, args) => {
        let user = message.mentions.users.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => null);
        if (!user) {
            user = message.author;
        }
     let color =  parseInt(client.color.replace("#", ""), 16);
      message.channel.send({
         embeds: [{
             color: color,
             title: `${user.username}`,
             image: { url : user.displayAvatarURL({ dynamic: true })}
         }
         ]
     })
    

    }
}


