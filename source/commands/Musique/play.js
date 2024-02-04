const { QueryType, SearchResult } = require("discord-player");
const { useMainPlayer, useQueue } = require("discord-player");
const regex = /(https?:\/\/(?:www\.)?(?:open\.spotify|deezer|soundcloud|music\.apple)\.[a-z\.]+\/[^\s]+)/g;
module.exports = {
    name: "play",
    run: async (client, message, args) => {
        const player = useMainPlayer();
        const queue = useQueue(message.guild.id);
        const channel = message.member.voice.channel;
        const query = args.join(" ");
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
        if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId){
            return message.reply({ embed: [{
                color: parseInt(client.color.replace("#", ""), 16),
                description: "Vous n'etes pas dans le même channel vocal que moi ! Veuillez me faire quitter le channel où je suis ou me moov avec \`+join\`",
                footer: client.config.footer
            }] });
        }
        if (!channel.viewable) {
            return message.reply({ embed: [{
                color: parseInt(client.color.replace("#", ""), 16),
                description: "Je ne peux pas voir le channel vocal !",
                footer: client.config.footer
            }] });
        }
        if (!channel.joinable) {
            return message.reply({ embed: [{
                color: parseInt(client.color.replace("#", ""), 16),
                description: "Je ne peux pas rejoindre le channel vocal !",
                footer: client.config.footer
            }] });
        }
        if (message.member.voice.channelId !== message.guild.members.me.voice.channelId && channel.full) {
            return message.reply({ embed: [{
                color: parseInt(client.color.replace("#", ""), 16),
                description: "Le channel vocal est plein !",
                footer: client.config.footer
            }] });
        }
        let que = QueryType.YOUTUBE;
        const matches = query.match(regex);
        if (matches) que = QueryType.AUTO;
        let searchResult = (await player.search(query, {
            requestedBy: message.user,
            searchEngine: que
        }))
        let msg = await message.channel.send({
            embeds: [{
                color: parseInt(client.color.replace("#", ""), 16),
                description: "Recherche en cours . . .",
                footer: client.config.footer
            }]
        });
        let text;
        text = " est en cours de lecture !"
        if (queue || (queue && queue.tracks.data.length > 0)) text = " à été ajouté à la queue !"
        await player.play(channel, searchResult, {
            nodeOptions: {
                metadata: {
                    channel: message.channel,
                    client: message.guild.members.me,
                    requestedBy: message.user,
                },
                selfDeaf: true,
                volume: 50,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 300000,
                leaveOnEnd: true,
                leaveOnEndCooldown: 300000,
            }
        })
        .then((song) => {
            msg.edit({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    description: `**${song.title}**${text}`,
                    footer: client.config.footer
                }], 
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: song.track.title,
                                style: 5,
                                url: song.track.url
                            }
                        ]
                    }
                ]
            })
        })
        .catch((e) => {
            if (e.message.includes(`No results found for "[object Object]"`)) {
                msg.edit({
                    embeds: [{
                        color: parseInt(client.color.replace("#", ""), 16),
                        description: "Aucun resultat !",
                        footer: client.config.footer
                    }]
                })
            }
        })

    }
}