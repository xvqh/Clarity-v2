const { useMainPlayer, useQueue } = require("discord-player");
module.exports = {
    name: "nowplaying",
    description: "affiche la musique qui est actuellement en cours d'écoute",
    run: async (client, message, args) => {
        const queue = useQueue(message.guild.id);
       
        if (!queue || !queue.isPlaying) {
            return message.reply("Aucune musique en cours");
        }
        const progress = queue.node.createProgressBar();
        message.reply({
            embeds: [{
                author: {name: message.author.tag, icon_url: message.author.displayAvatarURL({dynamic: true})},
                color: parseInt(client.color.replace("#", ""), 16),
                fields: [{
                    name: 'Titre',
                    value: `${queue.currentTrack.title}`
                }, {
                    name: 'Durée',
                    value: `${queue.currentTrack.duration}`
                }, {
                    name: 'Progression',
                    value: `${progress}`
                }, {
                    name: 'Volume',
                    value: `${queue.node.volume}%`
                }],
                thumbnail: {
                    url: queue.currentTrack.thumbnail
                },
                footer: client.config.footer
            }]
        });
    }
}