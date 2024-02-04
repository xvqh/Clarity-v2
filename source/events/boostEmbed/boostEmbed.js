module.exports = {
    name: 'guildMemberUpdate',
    run: async (client, oldMember, newMember) => {
        const { guild } = newMember;
        const oldStatus = oldMember.premiumSince;
        const newStatus = newMember.premiumSince;

        let logs = client.data.get(`boostdata_${guild.id}`) || {
            logs: null,
            status: false,
            boostmessage: [{
                title: 'Nouveau boost',
                description: 'Le membre [user] a boosté le serveur',
                image: null
            }],
            unboostmessage: [{
                title: 'Arrêt de boost',
                description: 'Le membre [user] a arrêter de boost le serveur',
                image: null
            }]
        };
        if (!logs) return;
        let channel = guild.channels.cache.get(logs);
        if (!channel) return;

        // member unboost the server
        if(oldStatus && !newStatus) {
            // get data info for the message and send it
            let message = logs.unboostmessage[Math.floor(Math.random() * logs.unboostmessage.length)];
            channel.send({
                embed: {
                    title: message.title,
                    description: message.description.replace('[user]', newMember),
                    image: {
                        url: message.image
                    }
                }
            });
        }

        // member boost the server
        if(!oldStatus && newStatus) {
            // get data info for the message and send it
            let message = logs.boostmessage[Math.floor(Math.random() * logs.boostmessage.length)];
            channel.send({
                embed: {
                    title: message.title,
                    description: message.description.replace('[user]', newMember),
                    image: {
                        url: message.image
                    }
                }
            });
        }



    }
}