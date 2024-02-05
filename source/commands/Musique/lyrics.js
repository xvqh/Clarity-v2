import Genius from 'genius-lyrics';
import { useQueue } from 'discord-player'; const Client = new Genius.Client("tRyLJnZ3tURA-PSPveoe-4K_MRzfFarg60E8lWXaj9Y9jETeKAIAfMdhk9KjOj4s");

export default {
    name: 'lyrics',
    category: 'Musique',
    aliases: ['lyric', 'ly'],
    description: 'Affiche les informations de la chanson',
    usage: 'lyrics',
    run: async (client, message, args) => {

        const queue = useQueue(message.guild.id);

        if (!queue) {
            return message.reply("Aucune chanson n'est en cours de lecture");
        }

        const firstSong = queue.currentTrack;

        if (!firstSong) {
            return message.reply("Aucune chanson n'est en cours de lecture");
        }

        const searches = await Client.songs.search(firstSong.title);

        const search = searches[0];
        const lyrics = await search.lyrics();

        if (lyrics.length > 2000) {
            const lyrics2 = splitText(lyrics, 2000);

            let page = 0;

            let msg = await message.channel.send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    description: lyrics2[page],
                    footer: client.config.footer,
                    author: { name: message.author.tag, icon_url: message.author.displayAvatarURL({ dynamic: true }) },
                    title: `Lyrics de ${firstSong.title}`
                }], components: [{
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: '<<',
                            custom_id: 'previous',
                            style: 1,
                            disabled: true,
                        },
                        {
                            type: 2,
                            label: '>>',
                            custom_id: 'next',
                            style: 1,
                            disabled: lyrics2.length <= 1,
                        },
                    ],
                }]
            })
            const collector = msg.createMessageComponentCollector({ time: 60000 })
            collector.on("collect", async (i) => {
                i.deferUpdate();
                if (i.user.id !== message.author.id) return i.reply({ content: "Tu n'as pas la permission d'intéragir avec cette interaction", ephemeral: true });
                if (i.customId === 'previous') {
                    page--;
                } else if (i.customId === 'next') {
                    page++;
                }

                if (page < 0) {
                    page = 0;
                } else if (page >= lyrics2.length) {
                    page = lyrics2.length - 1;
                }
                msg.edit({
                    embeds: [{
                        color: parseInt(client.color.replace("#", ""), 16),
                        description: lyrics2[page],
                        footer: client.config.footer,
                        author: { name: message.author.tag, icon_url: message.author.displayAvatarURL({ dynamic: true }) },
                        title: `Lyrics de ${firstSong.title}`
                    }],
                    components: [{
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: '<<',
                                custom_id: 'previous',
                                style: 1,
                                disabled: page === 0,
                            },
                            {
                                type: 2,
                                label: '>>',
                                custom_id: 'next',
                                style: 1,
                                disabled: page === lyrics2.length - 1,
                            },
                        ],
                    }]
                });
            })
        }
    }
}
function splitText(text, Length) {
    const chunks = [];
    let chunkouuu = '';

    for (const line of text.split('\n')) {
        if (chunkouuu.length + line.length + 1 <= Length) {
            chunkouuu += line + '\n';
        } else {
            chunks.push(chunkouuu);
            chunkouuu = line + '\n';
        }
    }

    if (chunkouuu.length > 0) {
        chunks.push(chunkouuu);
    }

    return chunks;
}