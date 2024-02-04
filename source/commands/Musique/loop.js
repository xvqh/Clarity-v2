const {useQueue} = require("discord-player")
const { QueueRepeatMode } = require("discord-player");
module.exports={
    name: "loop",
    description:"Loop the current song or queue.",
    category: "Musique",
    run: async (client, message, args) => {
        const queue = useQueue(message.guild.id);
        const channel = message.member.voice.channel;
        if (!channel) {
            return message.reply({ embed: [{
                color: parseInt(client.color.replace("#", ""), 16),
                description: "Vous n'êtes pas dans un channel vocal !",
                footer: client.config.footer
            }] });
        }
        if (queue && queue.channel.id !== channel.id) {
            return message.reply({ embed: [{
                color: parseInt(client.color.replace("#", ""), 16),
                description: "Je suis déja entrain de jouer dans un autre salon !",
                footer: client.config.footer
            }] });
        }
        if (!queue) return message.reply("Je n ai pas de musique en cours !");

        queue.setRepeatMode(queue.repeatMode === QueueRepeatMode.QUEUE ? QueueRepeatMode.TRACK : QueueRepeatMode.QUEUE);
        return message.reply({
            embeds: [{
                color: parseInt(client.color.replace("#", ""), 16),
                description: `La musique est maintenant \`${
                    queue.repeatMode === QueueRepeatMode.TRACK ? "En boucle" : "En file d attente"
                }\``,
                footer: client.config.footer
            }]
        })
    }
}