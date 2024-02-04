const { useMainPlayer, useQueue } = require("discord-player");
const maxVol = 100
module.exports = {
    name: "volume",
    description: "change le volume de la musique",
    run: async (client, message, args) => {
        const player = useMainPlayer();
        const queue = useQueue(message.guild.id);
        let vol = Number(args[0]);
        if (vol <= 0 || vol > maxVol) {
            return message.reply({embeds: [{
                color: parseInt(client.color.replace("#", ""), 16),
                description: "Le volume doit être compris entre 0 et 350 !",
                footer: client.config.footer
            }]});
        }
        if (!queue || !queue.isPlaying) {
            return message.reply("Aucune musique en cours");
        }
        if (queue.node.volume === vol) {
            return message.reply({embeds: [{
                color: parseInt(client.color.replace("#", ""), 16),
                description: "Musique deja régler a ce volume !",
                footer: client.config.footer
            }]});
        }
       let succes = queue.node.setVolume(vol);
        message.reply({
            embeds: [{
                author: {name: message.author.tag, icon_url: message.author.displayAvatarURL({dynamic: true})},
                color: parseInt(client.color.replace("#", ""), 16),
                description: succes ? `✅ Volume de la musique changer : ${vol}/${maxVol}%!` : '⛔ Je n ai pas réussi a mettre la musique en pause',
                fields: [{
                    name: 'Titre',
                    value: `${queue.currentTrack.title}`
                }, {
                    name: 'Duree',
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