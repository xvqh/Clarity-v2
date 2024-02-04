const { useMainPlayer, useQueue } = require("discord-player");
module.exports = {
    name: "pause",
    description: "Pause la musique",
    run: async (client, message, args) => {
        const player = useMainPlayer();
        const queue = useQueue(message.guild.id);
        if (!queue || !queue.isPlaying) {
            return message.reply("Aucune musique en cours");
        }
        if (queue.node.isPaused()) {
            return message.reply({embeds: [{
                color: parseInt(client.color.replace("#", ""), 16),
                description: "Musique deja en pause !",
                footer: client.config.footer
            }]});
        }
       let succes = queue.node.setPaused(true);
        message.reply({
            embeds: [{
                author: {name: message.author.tag, icon_url: message.author.displayAvatarURL({dynamic: true})},
                color: parseInt(client.color.replace("#", ""), 16),
                description: succes ? '✅ Musique mise en pause !' : '⛔ Je n ai pas réussi a mettre la musique en pause',
                fields: [{
                    name: 'Titre',
                    value: `${queue.currentTrack.title}`
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