import { useMainPlayer, useQueue } from "discord-player";

export default {
    name: "clearqueue",
    description: "clear la file d'attente",
    run: async (client, message, args) => {
        const player = useMainPlayer();
        const queue = useQueue(message.guild.id);
       
        if (!queue || !queue.isPlaying) {
            return message.reply("Aucune musique en cours");
        }
        if (!queue.tracks.toArray()[1]) {
            return message.reply("Aucune musique dans la file d'attente");
        }
        await queue.tracks.clear();
        message.reply({
            embeds: [{
                author: {name: message.author.tag, icon_url: message.author.displayAvatarURL({dynamic: true})},
                color: parseInt(client.color.replace("#", ""), 16),
                description: "La file d'attente a été vidée",
                footer: client.config.footer
            }]
        });
    }
}