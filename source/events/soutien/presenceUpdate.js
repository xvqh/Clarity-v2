module.exports = {
    name: "presenceUpdate",
    run: async (client, oldPresence, newPresence) => {
        const guildID = newPresence.guild?.id;
        if (!guildID) return;
        const db = client.data2.get(`soutien_${guildID}`) || {
            name: [],
            role: [],
            blacklist: [],
            only: false,
            allowed: false,
            status: false
        };
        if (!db) return;
        if (db.status === false || db.name.length === 0) return;
        const customStatus = newPresence.member?.presence?.activities[0]?.state;
        const rolesToAdd = db.role;
        const blRoles = db.blacklist;
        const member = newPresence.member;
   
        if (blRoles.length > 0) {
            if (member.roles.cache.some(role => blRoles.includes(role.id))) {
                return;
            }
        }
        if (db.allowed === true) {
            const invites = await member.guild.invites.fetch();
            const inviteCode = invites.find(i => i.inviter.id === member.id);
            if (db.status === true && customStatus) {
                if (inviteCode) {
                   if(customStatus.includes(inviteCode)) {
                       if (rolesToAdd.length > 0) {
                           try {
                               await member.roles.add(rolesToAdd);
                           } catch (error) {
                           }
                       }
                   } else {
                       const rolesToRemove = db.role;
                       if (rolesToRemove.length > 0) {
                           try {
                               await member.roles.remove(rolesToRemove);
                           } catch (error) {
                           }
                       }
                   }
                }
            }
        }

        if (db.only === true) {
            if (db.status === true && customStatus) {
                const words = customStatus.split(' ');
                const isInvalidStatus = words.some(word => !db.name.includes(word));
                if (isInvalidStatus) {
                  return;
                }
            }
         }
        if (db.status === true && customStatus) {
       
            if (customStatus.includes(db.name.join(' '))) {
                if (rolesToAdd.length > 0) {
                   try {
                       await member.roles.add(rolesToAdd);
                   } catch (error) {
                   }
                }
            } else {
                const rolesToRemove = db.role;
                if (rolesToRemove.length > 0) {
                   try {
                       await member.roles.remove(rolesToRemove);
                   } catch (error) {
                   }
                }
            }
        }
    }
 }; 