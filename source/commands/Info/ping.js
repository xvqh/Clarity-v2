import Discord from "discord.js";
import Clarity from "../../structures/client/index.js";

export default {
    name: 'ping',
    category: "💻〢Informations",
    /**
     * 
     * @param {Clarity} client 
     * @param {Discord.Message} message
     */
    run: async (client, message) => {
        let color = parseInt(client.color.replace("#", ""), 16);
        let embed = new Discord.EmbedBuilder()
        embed.setColor(color);
        embed.setTitle(`🏓 Pong!`);
        embed.addFields({
            name: "Latence du bot :",
            value: client.ws.ping + 'ms'
        })
        embed.setFooter(client.config.footer)
        message.channel.send({ embeds: [embed] }).then(async msg => {
            embed.addFields({ name: "API", value: msg.createdTimestamp - message.createdTimestamp + 'ms' })
            msg.edit({ embeds: [embed] })
        })



    }
}


