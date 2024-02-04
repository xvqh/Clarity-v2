const Discord = require('discord.js');
const Clarity = require('../../structures/client/index');

module.exports = {
    name: 'uptime', 
    aliases: [],
   category: "💻〢Informations",
    /**
     * 
     * @param {Clarity} client 
     * @param {Discord.Message} message
     */
    run: async (client, message, args) => {
     let color =  parseInt(client.color.replace("#", ""), 16);
     let totalSeconds = (client.uptime / 1000);
     let jours = Math.floor(totalSeconds / 86400);
     totalSeconds %= 86400;
     let heures = Math.floor(totalSeconds / 3600);
     totalSeconds %= 3600;
     let minutes = Math.floor(totalSeconds / 60);
     let secondes = Math.floor(totalSeconds % 60);
     message.channel.send({
        embeds: [{
            color: color,
           fields: [{
            name: "Uptime",
            value: `${jours} jours, ${heures} heures, ${minutes} minutes et ${secondes} secondes`,
           }]
        }
        ]
     })
    }
}


