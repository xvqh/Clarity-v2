import { Client, EmbedBuilder, Message } from 'discord.js';
import malScraper from 'mal-scraper';

export default {
    name: "anime",
    category: "fun",
    description: "Anime command",
    usage: "anime <title>",
    run: async (client: Client, message: Message, args: string[]) => {
        const search = `${args}`;
        if (!search)
            return message.reply(':x: | Veuillez ajouter une requête de recherche.');
        malScraper.getInfoFromName(search, true, 'anime')
            .then((data) => {
                console.log(data);
                const embed = new EmbedBuilder()
                    .setColor(parseInt(client.color.replace("#", ""), 16))
                    .setTitle(data.title)
                    .setURL(data.url)
                    .setDescription(data.synopsis ? data.synopsis.toString() : 'Inconnu')
                    .setThumbnail(data.picture ? data.picture.toString() : 'https://i.imgur.com/wl3gK0T.png')
                    .addFields(
                        { name: 'Nom Japonais', value: data.title ? data.title.toString() : 'Inconnu' },
                        { name: 'Nom Anglais', value: data.englishTitle ? data.englishTitle.toString() : 'Inconnu' },
                        { name: 'Type', value: data.type ? data.type.toString() : 'Inconnu' },
                        { name: 'Id', value: data.id ? data.id.toString() : 'Inconnu' },
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
                    )
                message.channel.send({
                    embeds: [
                        embed
                    ],
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
                let filter = (i: any) => i.user.id === message.author.id;
                const collector = message.channel.createMessageComponentCollector({ filter, time: 120000 });
                let page = 0;
                collector.on('collect', async (i) => {

                    if (i.customId === `next` + message.id) {
                        page++;
                        const embed = new EmbedBuilder()
                            .setColor(parseInt(client.color.replace("#", ""), 16))
                            .setTitle(data.characters ? data.characters[page].name : 'Inconnu')
                            .setURL(data.characters ? data.characters[page].link : 'Inconnu')
                            .setImage(data.characters ? data.characters[page].picture : 'https://i.imgur.com/wl3gK0T.png')
                            .setFooter(client.config.footer)
                            i.update({
                                embeds: [embed],
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
                                        disabled: page >= (data.characters ? data.characters.length - 1 : 0) ? true : false
                                    }]
                                }]
                            })
                      
                       
                    }
                    if (i.customId === `prev` + message.id) {
                        page--;
                        const embed = new EmbedBuilder()
                        .setColor(parseInt(client.color.replace("#", ""), 16))
                        .setTitle(data.characters ? data.characters[page].name : 'Inconnu')
                        .setURL(data.characters ? data.characters[page].link : 'Inconnu')
                        .setImage(data.characters ? data.characters[page].picture : 'https://i.imgur.com/wl3gK0T.png')
                        .setFooter(client.config.footer)
                        i.update({
                            embeds: [embed],
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
                                    disabled: page >= (data.characters ? data.characters.length - 1 : 0) ? true : false
                                }]
                            }]
                        })

                    }
                    if (i.customId === `anime_character` + message.id) {
                        const embed = new EmbedBuilder()
                            .setColor(parseInt(client.color.replace("#", ""), 16))
                            .setTitle(data.characters ? data.characters[0].name : 'Inconnu')
                            .setURL(data.characters ? data.characters[0].link : 'Inconnu')
                            .setImage(data.characters ? data.characters[0].picture : 'https://i.imgur.com/wl3gK0T.png')
                        i.reply({
                            embeds: [embed],
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
                                    disabled: page >= (data.characters ? data.characters.length - 1 : 0) ? true : false
                                }]
                            }],
                            ephemeral: true
                        })

                    }
                    if (i.customId === `anime_staff` + message.id) {
                        const embed = new EmbedBuilder()
                            .setColor(parseInt(client.color.replace("#", ""), 16))
                            .setTitle(data.staff ? (data.staff[0].name !== undefined ? data.staff[0].name : 'Inconnu') : 'Inconnu')
                            .setURL(data.staff ? (data.staff[0].link !== undefined ? data.staff[0].link : 'Inconnu') : 'Inconnu')
                            .setImage(data.staff ? (data.staff[0].picture !== undefined ? data.staff[0].picture : 'https://i.imgur.com/wl3gK0T.png') : 'https://i.imgur.com/wl3gK0T.png')

                        i.reply({
                            embeds: [embed],
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
                                    disabled: page >= (data.staff ? data.staff.length - 1 : 0) ? true : false
                                }]
                            }],
                            ephemeral: true
                        })
                    }
                    if (i.customId === `nexts` + message.id) {
                        page++;
                        const embed = new EmbedBuilder()
                        .setColor(parseInt(client.color.replace("#", ""), 16))
                        .setTitle(data.staff ? (data.staff[page]?.name ?? 'Inconnu') : 'Inconnu')
                        .setURL(data.staff ? (data.staff[page]?.link ?? 'Inconnu') : 'Inconnu')
                        .setImage(data.staff ? (data.staff[page]?.picture ?? 'https://i.imgur.com/wl3gK0T.png') : 'https://i.imgur.com/wl3gK0T.png')
                        .setFooter(client.config.footer)
                        i.update({
                            embeds: [embed],
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
                                    disabled: page >= (data.staff ? data.staff.length - 1 : 0) ? true : false
                                }]
                            }],
                        })
                    }
                    if (i.customId === `prevs` + message.id) {
                        page--;
                        const embed = new EmbedBuilder()
                        .setColor(parseInt(client.color.replace("#", ""), 16))
                        .setTitle(data.staff ? (data.staff[page]?.name ?? 'Inconnu') : 'Inconnu')
                        .setURL(data.staff ? (data.staff[page]?.link ?? 'Inconnu') : 'Inconnu')
                        .setImage(data.staff ? (data.staff[page]?.picture ?? 'https://i.imgur.com/wl3gK0T.png') : 'https://i.imgur.com/wl3gK0T.png')
                        .setFooter(client.config.footer)
                        i.update({
                            embeds: [embed],
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
                                    disabled: page >= (data.staff ? data.staff.length - 1 : 0) ? true : false
                                }]
                            }],
                        })
                    }
                })
            })
    }
}