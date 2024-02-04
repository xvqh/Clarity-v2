// module.exports = {
//     name: 'botInvited',
//     run: async(client, guild, member) => {
//         try {
//             const audit = await guild.fetchAuditLogs({limit: 1, type: 28}).catch(e=>{})
//             if (!audit) return;
//             const log = audit.entries.first();
//             if (!log) return;
//             if(Date.now() - log.createdTimestamp > 5000) return
//             // get the channel of inviteLogs of the guild
//             const channelId = client.data.get(`invitelogs_${guild.id}`)
//             if (!channelId) return;
//             // get the channel in the guild 
//             const channel = guild.channels.cache.get(channelId);
//             if (!channel) return;

//             // get embed data
//             const embedData = client.data.get(`welcomebotembed_${guild.id}`)
//             if (!embedData) return;
//             if(client.data.get(`welcomebot_isembed_${guild.id}`)) {
                
//             }
//         } catch(e) {
//             console.log(e)
//         }
//     }
// }