export default {
    name: "voicelimit",
    category: "Gestion",
    description: "Permet de configurer le voicelimit",
    run: async (client, message, args) => {

        const isOwn = await client.db.oneOrNone(
            `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
            [message.author.id]
        );
        if (!isOwn) {
            return message.reply({
                content: "Vous n'avez pas la permission d'utiliser cette commande",
            });
        }

        if (!args[0]) return message.reply({ content: "Veuillez bien utiliser la commande : \`<voicelimit set>\`/ \`<voicelimit remove>\`" })

        if (args[0] === "set") {
            //    get the voice channel id of the user
            const voiceChannelId = message.member.voice.channelId;
            const voiceChannel = message.guild.channels.cache.get(voiceChannelId);
            //     get the data of voicelimit with client.data.get
            let db = client.data.get(`voicelimit_${message.guild.id}_${voiceChannelId}`) || {
                limit: 0
            }

            //    set the limit of the voice
            let limit = args[1] ? parseInt(args[1], 10) : 2;

            if (!limit) return message.reply({ content: "Veuillez bien preciser la limite d utilisateur" })

            db.limit = limit

            client.data.set(`voicelimit_${message.guild.id}_${voiceChannelId}`, db)
            message.reply({
                embeds: [{
                    description: `La limite de ${voiceChannel} est de ${limit} utilisateurs !`,
                    color: parseInt(client.color.replace("#", ""), 16),
                    footer: { text: client.config.footer.text },
                    timestamp: new Date(),
                    thumbnail: { url: client.user.displayAvatarURL({ dynamic: true }) },
                    author: { name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) }
                }]
            })
        }

        if (args[0] === "remove") {
            //    get the voice channel id of the user
            const voiceChannelId = message.member.voice.channelId;
            const voiceChannel = message.guild.channels.cache.get(voiceChannelId);
            client.data.delete(`voicelimit_${message.guild.id}_${voiceChannelId}`)
            message.reply({
                embeds: [{
                    description: `La limite de ${voiceChannel} est supprimé !`,
                    color: parseInt(client.color.replace("#", ""), 16),
                    footer: { text: client.config.footer.text },
                    timestamp: new Date(),
                    thumbnail: { url: client.user.displayAvatarURL({ dynamic: true }) },
                    author: { name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) }
                }]
            })
        }
    }
}