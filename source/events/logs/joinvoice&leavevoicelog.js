module.exports = {
    name: 'voiceStateUpdate',
    run: async(client, oldState, newState)=> {
        const { member, guild } = oldState;
        const channel = member.voice.channel;
        if (!channel) return;
        let db = client.data.get(`voicelogs_${guild.id}`);
        if (!db) return;
        const chan = member.guild.channels.cache.get(db);
        if (!chan) return;
        // if the member join a voice channel
        if (!oldState.channel && newState.channel) {
            if (chan) chan.send({ embeds: [
                {
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {name: `${member.user.username}`, icon_url: member.user.displayAvatarURL({dynamic: true})},
                    thumbnail: {url: member.user.displayAvatarURL({dynamic: true})},
                    color: parseInt(client.color.replace("#", ""), 16),
                    description: `${member} se connecte au salon ${channel.name}`,
                    timestamp: new Date(),
                    footer: {
                           text: client.config.footer.text
                   }
                }
            ]})
        }
        // si le membre change de salon vocal 
        else if (oldState.channel !== newState.channel) {
                // send a message to the log channel
                if (chan) chan.send({embeds:[{
                color: parseInt(client.color.replace("#", ""), 16),
                author: {name: `${member.user.username}`, icon_url: member.user.displayAvatarURL({dynamic: true})},
                thumbnail: {url: member.user.displayAvatarURL({dynamic: true})},
                color: parseInt(client.color.replace("#", ""), 16),
                    description:`${member} change de salon`,
                    fields: [
                        {
                            name: `Ancien salon :`,
                            value:`\`${oldState.channel.name}\``
                        },{
                            name: `Salon actuel :`,
                            value:`\`${newState.channel.name}\``
                        }
                    ]
                }]})
        }
        // Si le membre quitte un salon vocal
        else if (oldState.channel && !newState.channel) {
            if (chan)  chan.send({ embeds: [
                {
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {name: `${member.user.username}`, icon_url: member.user.displayAvatarURL({dynamic: true})},
                    thumbnail: {url: member.user.displayAvatarURL({dynamic: true})},
                    color: parseInt(client.color.replace("#", ""), 16),
                    // embed description for the voice join
                    description: `${member} se déconnecte du salon ${oldState.channel.name}`,
                    timestamp: new Date(),
                    footer: {
                           text: client.config.footer.text
                   }
                }
            ]})
        }

    }
}