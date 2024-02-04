module.exports = {
    name: 'guildMemberAdd',
    run: async (client, member) => {
        const db = client.data.get(`autorolem_${member.guild.id}`)
        if (!db) return;
        if (db.status === false) return;
        const rolesToAdd = db.role

        rolesToAdd.forEach(roleID => {
            if (member.user.bot) return;
            const role = member.guild.roles.cache.get(roleID);
            if (role) {
                member.roles.add(role, { reason: 'Clarity | AutoRole Membre' });
            }
        });
        const dbb = client.data.get(`autorolebot_${member.guild.id}`)
        if (!dbb) return;
        if (dbb.status === false) return;
        const rolesToAddd = dbb.role

        rolesToAddd.forEach(roleID => {
            if (!member.user.bot) return;
            const role = member.guild.roles.cache.get(roleID);
            if (role) {
                member.roles.add(role, { reason: 'Clarity | AutoRole Bot' });
            }
        });
    }
}