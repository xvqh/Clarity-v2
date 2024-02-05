import { EmbedBuilder } from 'discord.js';

export default {
    name: "messageCreate",
    run: async (client, message) => {
        if (message.author.bot) return;

        let db = await client.data.get(`partnerdata_${message.guild.id}`) || {
            partrole: [],
            notifrole: []
        }

        let partnerLogChannelId = client.data.get(`partnerlog_${message.guild.id}`);
        let channel = client.channels.cache.get(partnerLogChannelId)
        let partrole = db.partrole;
        let notif = db.notifrole.map((r) => message.guild.roles.cache.get(r).toString()).join(", ")
        if (message.channel.id !== partnerLogChannelId) return;

        // Get the current count of partnerships for the user on this server
        let userdb = await client.data.get(`userPartners_${message.guild.id}_${message.author.id}`)

        // Initialize partnerNum with the current count or 1 if there's no count yet
        let partnerNum = userdb ? userdb : 1;

        // Add 1 to partnerNum
        partnerNum += 1;

        // Store the updated count in the database
        client.data.set(`userPartners_${message.guild.id}_${message.author.id}`, partnerNum);

        let embed = new EmbedBuilder()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription(message.content)
            .setTimestamp()
            .setFooter(client.config.footer)
            .setColor(client.color)

        if (message.attachments.first()) {
            embed.setImage(message.attachments.first().url);
        }

        embed.addFields({
            name: 'Nombre de partenariat realisé',
            value: `${partnerNum}`
        })

        channel.send({ content: `${notif ? notif : "@everyone"}`, embeds: [embed] })
    }
}
