import { useQueue } from 'discord-player';

export default {
    name: "queue",
    run: async (client, message, args) => {
        const queue = useQueue(message.guild.id);
       
        if (!queue || !queue.currentTrack) {
            return message.reply("Aucune musique en cours");
        }
        const channel = message.member.voice.channel;
        if (!channel) {
            return message.reply({ embed: [{
                color: parseInt(client.color.replace("#", ""), 16),
                description: "Vous n'êtes pas dans un channel vocal !",
                footer: client.config.footer
            }] });
        }
        if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId){
            return message.reply({ embed: [{
                color: parseInt(client.color.replace("#", ""), 16),
                description: "Vous n'etes pas dans le même channel vocal que moi ! Veuillez me faire quitter le channel où je suis ou me moov avec \`+join\`",
                footer: client.config.footer
            }] });
        }
        const currentSong = queue.currentTrack;
        message.channel.send({embeds: [{
            color: parseInt(client.color.replace("#", ""), 16),
            author: {name: message.author.tag, icon_url: message.author.displayAvatarURL({dynamic: true})},
            title: "Voici la file d'attente de: " + message.guild.name,
            fields: [
                {
                    name: "Musique Actuelle",
                    value: `\`\`\`js\n${currentSong.title} - (${currentSong.durationFormatted || currentSong.duration})\`\`\``
                }, {
                    name: "Prochaine musique",
                    value: `\`\`\`js\n${queue.tracks.data
                        .map((song, id) => `${id} - ${song.raw.title} - (${song.raw.durationFormatted || song.duration})`)
                        .slice(1, 11)
                        .join('\n')}\`\`\``
                },{
                    name: "Nombre de musiques dans la file d'attente",
                    value: `\`\`\`js\n${queue.tracks.data.length}\`\`\``
                }
            ],
            footer: client.config.footer 
        }]})
    }
}