
const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const Valory = require('../../structures/client');
module.exports = {
    name: "guildMemberRemove",
    run: async (client, member) => {
        const dbserveur = await client?.data2.get(`ticket_${member.guild.id}`)
        if(!dbserveur)return;
        try {
            const tickeruser = await client.data2.get(`ticket_user_${member.guild.id}`) || [];

            const userTickets = tickeruser.filter(ticket => ticket.author === member.id);

            for (const ticket of userTickets) {
                const channel = member.guild.channels.cache.get(ticket.salon);
                if (channel) {
                    await channel.delete();
                }
            }
            
            const updatedTickets = tickeruser.filter(ticket => ticket.author !== member.id);
            await client.data2.set(`ticket_user_${member.guild.id}`, updatedTickets);
        } catch (error) {
            console.error(error);
        }
    }
}