export default {
    name: "dero",
    aliases: [],
    category: "📝〢Moderation",
    description: "Masque tous les salon du serveur",
    run: async (client, message, args, prefix) => {
        if (!message.member.permissions.has('ADMINISTRATOR')) return;

        if (!args[0]) {
            const channels = message.guild.channels.cache;
            channels.forEach(channel => {
                channel.edit({
                    permissionOverwrites: [{
                        id: message.guild.id,
                        deny: 'ViewChannel'
                    }]
                });
            });

            const success = await message.channel.send({ content: "Toutes les dérogations ont été mises à jour." });
            setTimeout(() => {
                success.delete();
            }, 5000);

        } else if (args[0] && args[0].toLowerCase() === "off") {
            const channels = message.guild.channels.cache;
            channels.forEach(channel => {
                channel.edit({
                    permissionOverwrites: [{
                        id: message.guild.id,
                        allow: 'ViewChannel'
                    }]
                });
            });

            const success = await message.channel.send({ content: "Toutes les dérogations ont été mises à jour." });
            setTimeout(() => {
                success.delete();
            }, 5000);
        }
    }
};
