import { Client, GuildMember } from "discord.js";

export default {
    name: 'guildMemberAdd',
    run: async (client: Client, member: GuildMember) => {
        const db = await client.data.get(`autorolem_${member.guild.id}`)
        if (!db) return;
        if (db.status === false) return;
        const rolesToAdd = db.role;

        rolesToAdd.forEach((roleID: string) => {
            if (member.user.bot) return;
            const role = member.guild.roles.cache.get(roleID);
            if (role) {
                member.roles.add(role, 'Clarity | AutoRole Membre');
            }
        });
        const dbb = await client.data.get(`autorolebot_${member.guild.id}`)
        if (!dbb) return;
        if (dbb.status === false) return;
        const rolesToAddd = dbb.role

        rolesToAddd.forEach((roleID: string) => {
            if (!member.user.bot) return;
            const role = member.guild.roles.cache.get(roleID);
            if (role) {
                member.roles.add(role, 'Clarity | AutoRole Bot');
            }
        });
    }
}