import malScraper from 'mal-scraper';

export default {
    name: "anime",
    category: "fun",
    description: "Anime command",
    usage: "anime <title>",
    run: async (client, message, args) => {
        const search = `${args}`;
        if (!search)
            return message.reply(':x: | Veuillez ajouter une requête de recherche.');
        malScraper.getInfoFromName(search, 'anime')
            .then((data) => {
                console.log(data);
                message.channel.send({
                    embeds: [{
                        color: parseInt(client.color.replace("#", ""), 16),
                        author: { name: `Résultat de recherce pour ${args}`.split(',').join(' ') },
                        thumbnail: { url: data.picture },
                        footer: client.config.footer,
                        fields: [
                            { name: 'Nom Japonais', value: data.title ? data.title : 'Inconnu' },
                            { name: 'Nom Anglais', value: data.englishTitle ? data.englishTitle : 'Inconnu' },
                            { name: 'Type', value: data.type ? data.type : 'Inconnu' },
                            { name: 'Id', value: data.id ? data.id : 'Inconnu' },
                            { name: 'Status', value: data.status ? data.status : 'Inconnu' },
                            { name: 'Genre', value: data.genres ? data.genres.join(', ') : 'Inconnu' },
                            { name: 'Episodes', value: data.episodes ? data.episodes : 'Inconnu' },
                            { name: 'Score', value: data.score ? data.score : 'Inconnu' },
                            { name: 'Synopsis', value: data.synopsis ? data.synopsis : 'Inconnu' },
                            { name: 'Diffusion', value: data.aired ? data.aired : 'Inconnu' },
                            { name: 'Score', value: data.score ? data.score : 'Inconnu' },
                            { name: 'Note', value: data.scoreStats ? data.scoreStats : 'Inconnu' },
                            { name: 'Rangé', value: data.ranked ? data.ranked : 'Inconnu' },
                            { name: 'Popularité', value: data.popularity ? data.popularity : 'Inconnu' },
                            { name: 'Favoris', value: data.favorites ? data.favorites : 'Inconnu' },
                            { name: 'Duree', value: data.duration ? data.duration : 'Inconnu' },
                            { name: 'Trailer', value: data.trailer ? data.trailer : 'Inconnu' },
                            { name: 'Source', value: data.source ? data.source : 'Inconnu' },
                            { name: 'Rating', value: data.rating ? data.rating : 'Inconnu' },
                            { name: 'Membres', value: data.members ? data.members : 'Inconnu' },
                            { name: 'Personnage', value: data.characters ? data.characters.map((c) => c.name).join(' ') : 'Inconnu' },
                            { name: 'Staff', value: data.staff ? data.staff.map((c) => c.name).join(' ') : 'Inconnu' },
                        ],
                        timestamp: new Date(),
                        image: {
                            url:
                                data.picture
                        }
                    }],
                    components: [{
                        type: 1,
                        components: [{
                            type: 2,
                            label: 'Lien',
                            url: data.url,
                            style: 5
                        }, {
                            type: 2,
                            label: 'Liste des personnages ',
                            style: 2,
                            customId: `anime_character` + message.id
                        }, {
                            type: 2,
                            label: 'Liste des staff',
                            style: 2,
                            customId: `anime_staff` + message.id
                        }]
                    }]
                });
                let filter = (i) => i.user.id === message.author.id;
                const collector = message.channel.createMessageComponentCollector({ filter, time: 120000 });
                let page = 0;
                collector.on('collect', async (i) => {

                    if (i.customId === `next` + message.id) {
                        page++;
                        i.update({
                            embeds: [{
                                title: data.characters[page].name,
                                color: parseInt(client.color.replace("#", ""), 16),
                                image: { url: data.characters[page].picture },
                            }],
                            components: [{
                                type: 1,
                                components: [{
                                    type: 2,
                                    label: '<<',
                                    style: 2,
                                    customId: `prev` + message.id,
                                    disabled: page <= 0 ? true : false
                                }, {
                                    type: 2,
                                    label: '>>',
                                    style: 2,
                                    customId: `next` + message.id,
                                    disabled: page >= data.characters.length - 1 ? true : false
                                }]
                            }],
                            ephemeral: true
                        })
                        // return un mess d erreur si on a atteint la dernière page
                        if (page >= data.characters.length) {
                            page = data.characters.length - 1;
                            i.update({
                                embeds: [{
                                    title: data.characters[page].name,
                                    color: parseInt(client.color.replace("#", ""), 16),
                                    image: { url: data.characters[page].picture },
                                }],
                                components: [{
                                    type: 1,
                                    components: [{
                                        type: 2,
                                        label: '<<',
                                        style: 2,
                                        customId: `prev` + message.id
                                    }, {
                                        type: 2,
                                        label: '>>',
                                        style: 2,
                                        customId: `next` + message.id
                                    }]
                                }],
                                ephemeral: true
                            })
                        }
                    }
                    if (i.customId === `prev` + message.id) {
                        page--;
                        i.update({
                            embeds: [{
                                title: data.characters[page].name,
                                color: parseInt(client.color.replace("#", ""), 16),
                                image: { url: data.characters[page].picture },
                            }],
                            components: [{
                                type: 1,
                                components: [{
                                    type: 2,
                                    label: '<<',
                                    style: 2,
                                    customId: `prev` + message.id,
                                    disabled: page <= 0 ? true : false
                                }, {
                                    type: 2,
                                    label: '>>',
                                    style: 2,
                                    customId: `next` + message.id,
                                    disabled: page >= data.characters.length - 1 ? true : false
                                }]
                            }],
                            ephemeral: true
                        })

                        // return un message si on est sur la première page
                        if (page < 0) {
                            page = 0;
                            i.update({
                                embeds: [{
                                    title: data.characters[page].name,
                                    color: parseInt(client.color.replace("#", ""), 16),
                                    image: { url: data.characters[page].picture },
                                }],
                                components: [{
                                    type: 1,
                                    components: [{
                                        type: 2,
                                        label: '<<',
                                        style: 2,
                                        customId: `prev` + message.id,
                                        disabled: page <= 0 ? true : false
                                    }, {
                                        type: 2,
                                        label: '>>',
                                        style: 2,
                                        customId: `next` + message.id,
                                        disabled: page >= data.characters.length - 1 ? true : false
                                    }]
                                }],
                                ephemeral: true
                            })
                        }
                    }
                    if (i.customId === `anime_character` + message.id) {
                        i.reply({
                            embeds: [{
                                title: data.characters[0].name,
                                color: parseInt(client.color.replace("#", ""), 16),
                                image: { url: data.characters[0].picture },
                            }],
                            components: [{
                                type: 1,
                                components: [{
                                    type: 2,
                                    label: '<<',
                                    style: 2,
                                    customId: `prev` + message.id,
                                    disabled: page <= 0 ? true : false
                                }, {
                                    type: 2,
                                    label: '>>',
                                    style: 2,
                                    customId: `next` + message.id,
                                    disabled: page >= data.characters.length - 1 ? true : false
                                }]
                            }],
                            ephemeral: true
                        })

                    }
                    if (i.customId === `anime_staff` + message.id) {
                        i.reply({
                            embeds: [{
                                title: data.staff[0].name,
                                color: parseInt(client.color.replace("#", ""), 16),
                                image: { url: data.staff[0].picture },
                            }],
                            components: [{
                                type: 1,
                                components: [{
                                    type: 2,
                                    label: '<<',
                                    style: 2,
                                    customId: `prevs` + message.id,
                                    disabled: page <= 0 ? true : false
                                }, {
                                    type: 2,
                                    label: '>>',
                                    style: 2,
                                    customId: `nexts` + message.id,
                                    disabled: page >= data.staff.length - 1 ? true : false
                                }]
                            }],
                            ephemeral: true
                        })
                    }
                    if (i.customId === `nexts` + message.id) {
                        page++;
                        i.update({
                            embeds: [{
                                title: data.staff[page].name,
                                color: parseInt(client.color.replace("#", ""), 16),
                                image: { url: data.staff[page].picture },
                            }],
                            components: [{
                                type: 1,
                                components: [{
                                    type: 2,
                                    label: '<<',
                                    style: 2,
                                    customId: `prevs` + message.id,
                                    disabled: page <= 0 ? true : false
                                }, {
                                    type: 2,
                                    label: '>>',
                                    style: 2,
                                    customId: `nexts` + message.id,
                                    disabled: page >= data.staff.length - 1 ? true : false
                                }]
                            }],
                            ephemeral: true
                        })
                    }
                    if (i.customId === `prevs` + message.id) {
                        page--;
                        i.update({
                            embeds: [{
                                title: data.staff[page].name,
                                color: parseInt(client.color.replace("#", ""), 16),
                                image: { url: data.staff[page].picture },
                            }],
                            components: [{
                                type: 1,
                                components: [{
                                    type: 2,
                                    label: '<<',
                                    style: 2,
                                    customId: `prevs` + message.id,
                                    disabled: page <= 0 ? true : false
                                }, {
                                    type: 2,
                                    label: '>>',
                                    style: 2,
                                    customId: `nexts` + message.id,
                                    disabled: page >= data.staff.length - 1 ? true : false
                                }]
                            }],
                            ephemeral: true
                        })
                    }
                })
            })
    }
}