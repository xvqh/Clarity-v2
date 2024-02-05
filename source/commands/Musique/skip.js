import { useQueue } from 'discord-player';

export default {
    name: 'skip',
    description: 'Skip the current playing song',
    category: "musique",
    run: async (client, message, args) => {
        const queue = useQueue(message.guild.id);
        if (!queue || !queue.isPlaying) {
            return message.reply({
                content: "Aucune musique en cours"
            })
        }
        const channel = message.member.voice.channel;
        if (!channel) {
            return message.reply({
                embed: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    description: "Vous n'êtes pas dans un channel vocal !",
                    footer: client.config.footer
                }]
            });
        }
        if (queue && queue.channel.id !== channel.id) {
            return message.reply({
                embed: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    description: "Je suis déja entrain de jouer dans un autre salon !",
                    footer: client.config.footer
                }]
            });
        }
        // recupere la musique actuellement en cours de lecture
        const currentSong = queue.currentTrack;

        queue.node.skip();
        return message.reply({
            embeds: [{
                color: parseInt(client.color.replace("#", ""), 16),
                description: "Je viens de skip : " + currentSong,
                footer: client.config.footer
            }]
        })


    }
}