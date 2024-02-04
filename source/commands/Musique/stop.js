const { useMainPlayer, useQueue } = require('discord-player');
module.exports = {
    name: "stop",
    category: "Musique",
    description: "Stop la musique",
    run: async (client, message, args) => {
        const player = useMainPlayer();
        const queue = useQueue(message.guild.id);
        if (!queue || !queue.isPlaying) {
            return message.reply("Aucune musique en cours");
        }
        queue.delete();
        message.reply({
            embeds: [{
                color: parseInt(client.color.replace("#", ""), 16),
                description: "Musique arrêtée avec succès !",
                footer: client.config.footer
            }]
        });
    }
}