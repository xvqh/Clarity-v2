const Discord = require('discord.js')
const { 
    joinVoiceChannel, createAudioResource, createAudioPlayer, getVoiceConnection
} = require('@discordjs/voice');
const { StringSelectMenuBuilder, ActionRowBuilder, EmbedBuilder, ChannelSelectMenuComponent } = require('discord.js');
module.exports = {
    name: 'radio',
    aliases: ['rad'],
    category: 'Musique',
    utilisation: '{prefix}radio [url]',
    run: async(client, message) => {
        const row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('radio' + message.id)
            .setPlaceholder("📻 Choisissez Votre Radio")
            .addOptions([
                {
                    label: "NRJ",
                    description: "Permet d'écouter la Radio NRJ.",
                    value: "un"   
                },
                {
                    label: "NOSTALGIE",
                    description: "Permet d'écouter la radio NOSTALGIE.",
                    value: "deux"
                },
                {
                    label: "CHERIE",
                    description: "Permet d'écouter la radio CHERIE.",
                    value: "trois"
                },
                {
                    label: "Rire & Chansons",
                    description: "Permet d'écouter la radio Rire & Chansons.",
                    value: "quatre"
                },
                {
                    label: "RTL",
                    description: "Permet d'écouter la radio RTL.",
                    value: "cinq"
                },
                {
                    label: "RTL 2",
                    description: "Permet d'écouter la radio RTL 2.",
                    value: "six"
                },
                {
                    label: "Fun Radio France",
                    description: "Permet d'écouter la radio Fun Radio France.",
                    value: "sept"
                },
                {
                    label: "Europe 1",
                    description: "Permet d'écouter la radio Europe 1.",
                    value: "huit"
                },
                {
                    label: "Europe 2",
                    description: "Permet d'écouter la radio Europe 2",
                    value: "neuf"
                },
                {
                    label: "RFM",
                    description: "Permet d'écouter la radio RFM",
                    value: "dix"
                },
                {
                    label: "RMC",
                    description: "Permet d'écouter la radio RMC",
                    value: "onze"
                },
                {
                    label: "BFM Business",
                    description: "Permet d'écouter la radio BFM Business",
                    value: "douze"
                },
                {
                    label: "Skyrock",
                    description: "Permet d'écouter la radio Skyrock",
                    value: "treize"
                },
                {
                    label: "Radio Classique",
                    description: "Permet d'écouter la radio Radio Classique",
                    value: "quatorze"
                },
                {
                    label: "France Info",
                    description: "Permet d'écouter la radio France Info",
                    value: "quinze"
                },
                {
                    label: "France Inter",
                    description: "Permet d'écouter la radio France Inter",
                    value: "seize"
                },
                {
                    label: "France Culture",
                    description: "Permet d'écouter la radio France Culture",
                    value: "dixsept"
                },
                {
                    label: "France Musique",
                    description: "Permet d'écouter la radio France Musique",
                    value: "dixhuit"
                },
                {
                    label: "France Bleu",
                    description: "Permet d'écouter la radio France Bleu",
                    value: "dixneuf"
                },
                {
                    label: "Fip - Nationale",
                    description: "Permet d'écouter la radio Fip - Nationale",
                    value: "vingt"
                },
                {
                    label: "Mouv'",
                    description: "Permet d'écouter la radio Mouv'",
                    value: "vingtun"
                },
                {
                    label: "Ouï FM",
                    description: "Permet d'écouter la radio Ouï FM",
                    value: "vingtdeux"
                },
                {
                    label: "Jazz Radio",
                    description: "Permet d'écouter la radio Jazz Radio",
                    value: "vingttrois"
                },
                {
                    label: "M Radio",
                    description: "Permet d'écouter la radio M Radio",
                    value: "vingtquatre"
                },
                {
                    label: "Arrêter la radio",
                    description: "Permet d'arrêter la radio",
                    value: "off"
                }   
            ])
        )
        message.channel.send({ embeds: [{
            color: parseInt(client.color.replace("#", ""), 16),
            description: "Utilisez le menu ci-dessous pour choisir votre radio.\nVous avez un choix de **24** radios.",
            thumbnail: { url: "https://cdn.discordapp.com/attachments/1043183182809853450/1043183191367860512/IMG_20230514_121847.jpg" },
            footer: client.config.footer
        }],components: [row] })
        const collector = message.channel.createMessageComponentCollector({
            componentType: Discord.ComponentType.StringSelect,
        })
        collector.on("collect", async (i) => {
            try {
                if(i.user.id !== message.author.id) return c.reply({ content: `Vous ne pouvez pas modifier la radio de quelqu'un d'autre.`, ephemeral: true })
            } catch (error) {
                console.log("Une erreur est survenue" + error);
            }
            i.deferUpdate()
            if (i.values[0] === "off") {
                const connection = getVoiceConnection(message.guild.id)
                if(connection) {
                    connection.destroy()
                    message.channel.send({ embeds: [{
                        color: parseInt(client.color.replace("#", ""), 16),
                        description: "La radio a été arreter.",
                        footer: client.config.footer
                    }]})
                }
            }
            let links = { un: "https://scdn.nrjaudio.fm/adwz2/fr/30001/mp3_128.mp3?origine=fluxradios", deux: "https://scdn.nrjaudio.fm/adwz2/fr/30601/mp3_128.mp3?origine=fluxradios", trois: "https://scdn.nrjaudio.fm/adwz2/fr/30201/mp3_128.mp3?origine=fluxradios", quatre: "https://scdn.nrjaudio.fm/adwz2/fr/30401/mp3_128.mp3?origine=fluxradios", cinq: "http://icecast.rtl.fr/rtl-1-44-128?listen=webCwsBCggNCQgLDQUGBAcGBg", six: "http://icecast.rtl2.fr/rtl2-1-44-128?listen=webCwsBCggNCQgLDQUGBAcGBg", sept: "http://icecast.funradio.fr/fun-1-44-128?listen=webCwsBCggNCQgLDQUGBAcGBg", huit: "http://stream.europe1.fr/europe1.mp3", neuf: "http://europe2.lmn.fm/europe2.mp3", dix: "http://stream.rfm.fr/rfm.mp3", onze: "http://audio.bfmtv.com/rmcradio_128.mp3", douze: "http://audio.bfmtv.com/bfmbusiness_128.mp3", treize: "http://icecast.skyrock.net/s/natio_aac_128k", quatorze: "http://radioclassique.ice.infomaniak.ch/radioclassique-high.mp3", quinze: "http://icecast.radiofrance.fr/franceinfo-hifi.aac", seize: "http://icecast.radiofrance.fr/franceinter-hifi.aac", dixsept: "http://icecast.radiofrance.fr/franceculture-hifi.aac", dixhuit: "http://icecast.radiofrance.fr/francemusique-hifi.aac", dixneuf: "http://direct.francebleu.fr/live/fbnord-midfi.mp3", vingt: "http://icecast.radiofrance.fr/fip-hifi.aac", vingtun: "http://icecast.radiofrance.fr/mouv-hifi.aac", vingtdeux: "http://ouifm.ice.infomaniak.ch/ouifm-high.mp3", vingttrois: "http://jazzradio.ice.infomaniak.ch/jazzradio-high.mp3", vingtquatre: "http://mfm.ice.infomaniak.ch/mfm-128.mp3" }
            let thislive = links[i.values[0]]
            const connection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator
            });
            const live = createAudioResource(`${thislive}`, {
                inlineVolume: true
            }); 
            try{
          

                live.volume.setVolume(0.2)
                const player = createAudioPlayer()
                connection.subscribe(player)
                player.play(live)
                message.channel.send({ embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    description: `Radio en cours d ecoute.`,
                    footer: client.config.footer
                }]})
            }catch(err){
                console.log(err)
            }
        })
    }
}