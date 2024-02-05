export default {
    name: 'guildMemberAdd',
    run: async(client, member) => {
        const {guild} = member
        if(!guild) return
        let db = client.data.get(`raidmode_${guild.id}`) || {
            status: false,
            message: null,
            logs: null
        }
        if(db.status === true){
            guild.channels.cache.get(db.logs).send({embeds: [{title: 'Raid-Mode', color: parseInt(client.color.replace("#", ""), 16), description: `${member} a rejoins le serveur ${guild.name} alors que le Raid-Mode est actif je l'ai donc expulser`, footer: client.config.footer}]})
            let message = db?.message ? db.message : "Vous avez rejoint le serveur " + guild.name + " alors que le Raid-Mode est actif";
            try {
                await member.send({content: message});
            } catch (err) {
                console.log(err);
            } finally {
                await member.kick({reason: "Raid-Mode"});
                // add 1 to raidmode_counter
                client.data.set(`raidmode_counter_${guild.id}`, parseInt(client.data.get(`raidmode_counter_${guild.id}`) || 0) + 1);
            }
        }
    }
}