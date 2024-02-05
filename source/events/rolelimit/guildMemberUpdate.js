export default {
    name: "guildMemberUpdate",
    run: async (client, oldMember, newMember) => {
        // Check if the role was added
        if (oldMember.roles.cache.size < newMember.roles.cache.size) {
            // Find the added role
            const addedRole = newMember.roles.cache.find(role => !oldMember.roles.cache.has(role.id));

            // Check if the added role has a limit
            let db = await client.data.get(`rolelimit_${newMember.guild.id}_${addedRole.id}`) || {
                limit: 0
            };

            let originalRoleName = client.data.get(`originalRoleName_${newMember.guild.id}_${addedRole.id}`);
            if (db.limit > 0) {
                // Calculate the current member count
                const memberCount = newMember.guild.members.cache.filter(member => member.roles.cache.has(addedRole.id)).size;

                // Log the memberCount to check its value
                console.log(memberCount);

                if (memberCount < db.limit) {
                    // Fetch the role from the guild
                    const role = newMember.guild.roles.cache.get(addedRole.id);

                    // Rename the role to include the member count
                    const newName = `${originalRoleName} [${memberCount}/${db.limit}]`;
                    await role.edit({ name: newName });
                }
                // If the member count exceeds the limit, remove the role
                if (memberCount > db.limit) {
                    await newMember.roles.remove(addedRole);
                } else {
                    // Rename the role to include the member count
                    const newName = `${originalRoleName} [${memberCount}/${db.limit}]`;
                    await addedRole.edit({ name: newName });
                }
            }
        }
    }
}