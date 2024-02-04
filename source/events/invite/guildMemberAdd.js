// module.exports = {
//     name: 'guildMemberAdd',
//     run: async(client, member) => {
//         const {guild} = member
//         if(!guild) return
//         client.data.add(`joincount_${guild.id}_${member.id}`, 1)
//         if(member.user.bot) {
//             return client.emit('botInvited')
//         } else {

//         }
//     }
// }