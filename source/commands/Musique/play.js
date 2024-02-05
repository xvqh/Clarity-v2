import { useMainPlayer, useQueue, QueryType, SearchResult } from "discord-player";

const regex = /(https?:\/\/(?:www\.)?(?:open\.spotify|deezer|soundcloud|music\.apple)\.[a-z\.]+\/[^\s]+)/g;
const youtubeRegex = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/;
const playlistRegex = /(https?:\/\/(?:www\.)?(?:open\.spotify|deezer|soundcloud|music\.apple)\.[a-z\.]+\/playlist\/[^\s]+)/g;
export default {
    name: "play",
    run: async (client, message, args) => {
        const player = useMainPlayer();
        const queue = useQueue(message.guild.id);
        const channel = message.member.voice.channel;
        const query = args.join(" ");
        // if (youtubeRegex.test(query)) {
        //     return message.channel.send({ embeds: [{
        //             color: parseInt(client.color.replace("#", ""), 16),
        //             description: "Les liens YouTube ne sont pas autorisés !",
        //             footer: client.config.footer
        //         }] });
        // }

        if (!channel) {
            return message.reply({ embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    description: "Vous n'êtes pas dans un channel vocal !",
                    footer: client.config.footer
                }] });
        }
        if (queue && queue.channel.id !== channel.id) {
            return message.reply({ embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    description: "Je suis déja entrain de jouer dans un autre salon !",
                    footer: client.config.footer
                }] });
        }
        if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId){
            return message.reply({ embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    description: "Vous n'etes pas dans le même channel vocal que moi ! Veuillez me faire quitter le channel où je suis ou me moov avec \`+join\`",
                    footer: client.config.footer
                }] });
        }
        if (!channel.viewable) {
            return message.reply({ embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    description: "Je ne peux pas voir le channel vocal !",
                    footer: client.config.footer
                }] });
        }
        if (!channel.joinable) {
            return message.reply({ embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    description: "Je ne peux pas rejoindre le channel vocal !",
                    footer: client.config.footer
                }] });
        }
        if (message.member.voice.channelId !== message.guild.members.me.voice.channelId && channel.full) {
            return message.reply({ embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    description: "Le channel vocal est plein !",
                    footer: client.config.footer
                }] });
        }
        if (playlistRegex.test(query)) {
            player.play(channel, query, {
                firstResult: true
            }).then(() => {
                message.channel.send({ embeds: [{
                        color: parseInt(client.color.replace("#", ""), 16),
                        description: "La playlist a été ajoutée à la file d'attente!",
                        timestamp: new Date(),
                        author: {
                            name: message.author.tag,
                            icon_url: message.author.displayAvatarURL({ dynamic: true })
                        },
                        footer: client.config.footer
                    }] });
            }).catch((error) => {
                message.channel.send({ embeds: [{
                        color: parseInt(client.color.replace("#", ""), 16),
                        description: "Erreur lors de la lecture de la playlist : " + error.message,
                        footer: client.config.footer
                    }] });
            });
        } else {
            let que = QueryType.SPOTIFY;
            const matches = query.match(regex);
            if (matches) que = QueryType.AUTO;
            let searchResult = (await player.search(query, {
                requestedBy: message.user,
                searchEngine: que
            }))
            let msg = await message.channel.send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    description: "💽 Recherche en cours . . .",
                    footer: client.config.footer
                }]
            });
            let text;
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
                            timestamp: new Date(),
                            thumbnail: {
                                url: song.track.thumbnail
                            },
                            author: {
                                name: message.author.tag,
                                icon_url: message.author.displayAvatarURL({ dynamic: true })
                            },
                            url: song.track.url,
                            fields: [{
                                name: "Titre",
                                value: song.track.title
                            },
                                {
                                    name: "Durée",
                                    value: song.track.duration
                                },{
                                    name: "Auteur",
                                    value: song.track.author
                                }
                            ],
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
}
