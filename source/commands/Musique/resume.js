const { useMainPlayer, useQueue } = require("discord-player");
module.exports = {
    name: "resume",
    description: "Reprends la musique",
    run: async (client, message, args) => {
        const player = useMainPlayer();
        const queue = useQueue(message.guild.id);
        if (!queue || !queue.isPlaying) {
            return message.reply("Aucune musique en cours");
        }
        if (!queue.node.isPaused()) {
            return message.reply({embeds: [{
                color: parseInt(client.color.replace("#", ""), 16),
                description: "Aucune musique en pause !",
                footer: client.config.footer
            }]});
        }
       let succes = queue.node.setPaused(false);
        message.reply({
            embeds: [{
                author: {name: message.author.tag, icon_url: message.author.displayAvatarURL({dynamic: true})},
                color: parseInt(client.color.replace("#", ""), 16),
                description: succes ? '✅ Musique relancée avec succès !' : '⛔ Je n ai pas réussi a relancer la musique',
                fields: [{
                    name: 'Titre',
                    value: `${queue.currentTrack.title}`,
                }, {
                    name: 'Durée',
                    value: `${queue.currentTrack.duration}`
                }],
                thumbnail: {
                    url: queue.currentTrack.thumbnail
                },
                footer: client.config.footer
            }]
        });
    }
}