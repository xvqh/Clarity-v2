module.exports = {
    name: 'prisonclear',
    run: async(client , message, args) => {
        const isOwn = await client.db.oneOrNone(
            `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
            [message.author.id]
        );
        if (!isOwn) {
            return message.reply({
                content: "Vous n'avez pas la permission d'utiliser cette commande",
            });
        }

        // Fetch all users in prison
        let prisoners = await client.db.any(`
            SELECT * FROM clarity_${client.user.id}_${message.guild.id}_prison
        `);

        // Initialize counter for released prisoners
        let releasedPrisoners = 0;

        // Get the prison role
        let prisonrole = await client.data.get(`prisondata_${message.guild.id}`) || {
            channel: null,
            role: [],
            status: false
        }

        // Loop through each prisoner and restore their roles
        for (let prisoner of prisoners) {
            let user = await client.users.fetch(prisoner.user_id);
            if (user) {
                let member = message.guild.members.cache.get(user.id);
                if (member) {
                    let dbroles = await client.data2.get(`oldroles_${message.guild.id}_${user.id}`) || {
                        roles: []
                    };
                    // Ensure roles is an array
                    let roles = Array.isArray(dbroles.roles) ? dbroles.roles.map((role) => message.guild.roles.cache.get(role)).filter(role => role !== undefined && role.id !== message.guild.id) : [];
                    try {
                        await member.roles.add(roles);
                    } catch (error) {
                        console.error(`Failed to add roles to user ${user.id}: ${error}`);
                        await client.db.none(`
                            DELETE FROM clarity_${client.user.id}_${message.guild.id}_prison WHERE user_id = $1
                        `, [user.id]);
                        if (prisonrole.role) {
                            await member.roles.remove(prisonrole.role);
                        }
                        continue;
                    }
                    if (prisonrole.role) {
                        await member.roles.remove(prisonrole.role);
                    }
                    // Increment the counter
                    releasedPrisoners++;
                } else {
                    // Remove user from prison database if they're not found in the guild
                    await client.db.none(`
                        DELETE FROM clarity_${client.user.id}_${message.guild.id}_prison WHERE user_id = $1
                    `, [prisoner.user_id]);
                    let member = message.guild.members.cache.get(user.id);
                    if (member && prisonrole.role) {
                        await member.roles.remove(prisonrole.role);
                    }
                    releasedPrisoners++;
                }
            }
        }

        // Clear the prison
        await client.db.none(`
            DELETE FROM clarity_${client.user.id}_${message.guild.id}_prison
        `);

        message.reply({
            content: `Tous les utilisateurs ont été libérés de la prison. Nombre total d'utilisateurs libérés: \`\`\`${releasedPrisoners}\`\`\``
        });
    }
}
