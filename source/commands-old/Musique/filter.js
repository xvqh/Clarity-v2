export default {
    name: "filter",
    description: "Change le filtre de la chanson",
    category: "Musique",
    run: async (client, message, args) => {
        const isDJ = await client.db.oneOrNone(
            `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_dj WHERE user_id = $1`,
            [message.author.id]
        );
        if (!isDJ) {
            return message.reply({
                content: "Vous n'avez pas la permission d'utiliser cette commande",
            });
        }
        let msg = await message.channel.send({ content: 'Chargement du module en cours . . .' });
        await embed(client, message, msg);
    }
}

async function embed(client, message, msg) {
    await msg.edit({
        content: null,
        embeds: [{
            title: 'Panel pour changer le filtre de la chanson',
            color: parseInt(client.color.replace("#", ""), 16)
        }],
        components: [{
            type: 1,
            components: [
                {
                    type: 3,
                    custom_id: 'filter' + message.id,
                    options: [
                        { label: '8d', value: '8d' },
                        { label: 'vaporwave', value: 'vaporwave' },
                        { label: 'nightcore', value: 'nightcore' },
                        { label: 'phaser', value: 'phaser' },
                        { label: 'tremolo', value: 'tremolo' },
                        { label: 'vibrato', value: 'vibrato' },
                        { label: 'reverse', value: 'reverse' },
                        { label: 'treble', value: 'treble' }
                    ],
                },
            ]
        }, {
            type: 1,
            components: [
                {
                    type: 3,
                    custom_id: 'filter2' + message.id,
                    options: [
                        { label: 'bassboost_low', value: 'bassboost_low' },
                        { label: 'bassboost_high', value: 'bassboost_high' },
                        { label: 'normalizer2', value: 'normalizer2' },
                        { label: 'compressor', value: 'compressor' },
                        { label: 'expander', value: 'expander' },
                        { label: 'limiter', value: 'limiter' },
                        { label: 'equalizer', value: 'equalizer' },
                        { label: 'mstlr', value: 'mstlr' },
                        { label: 'mstrr', value: 'mstrr' },
                        { label: 'silenceremove', value: 'silenceremove' }
                    ]
                }]
        }, {
            type: 1,
            components: [{
                type: 3,
                custom_id: 'filter3' + message.id,
                options: [
                    { label: 'normalizer', value: 'normalizer' },
                    { label: 'earwax', value: 'earwax' },
                    { label: 'soft', value: 'soft' },
                    { label: 'pulsator', value: 'pulsator' },
                    { label: 'subboost', value: 'subboost' },
                    { label: 'karaoke', value: 'karaoke' },
                    { label: 'flanger', value: 'flanger' },
                    { label: 'gate', value: 'gate' },
                    { label: 'haas', value: 'haas' },
                    { label: 'mcompand', value: 'mcompand' },
                    { label: 'lofi', value: 'lofi' },
                    { label: 'bassboost', value: 'bassboost' },
                    { label: 'mono', value: 'mono' },
                    { label: 'surround', value: 'surround' },
                    { label: 'stereo', value: 'stereo' }
                ]
            }]
        }]
    });

    const filter = (i) => i.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 60000 });
}