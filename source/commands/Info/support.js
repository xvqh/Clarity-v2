const Discord = require('discord.js');
const Clarity = require('../../structures/client/index');

module.exports = {
    name: 'support', 
    aliases: [],
   category: "💻〢Informations",
    /**
     * 
     * @param {Clarity} client 
     * @param {Discord.Message} message
     */
    run: async (client, message, args) => {
     let color =  parseInt(client.color.replace("#", ""), 16);
     message.channel.send({
        embeds: [{
            color: color,
            title: `Support - ζ͜͡Clarity`,
            description: `[\`Mon Support\`](https://discord.gg/devland)`
        }
        ]
     })
    

    }
}


