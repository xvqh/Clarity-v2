export default {
    name: 'interactionCreate',
    run: async (client, interaction) => {
        if (!interaction.isButton()) return;
        if (!interaction.guild) return;
        let db = await client.data.get(`verifdata_${interaction.guild.id}`) || {
            channel: null,
            role: [],
            status: false,
            emoji: '✅',
            messageid: null,
            text: null,
        }
        const { customId, user } = interaction;
        if (customId.startsWith('verif')) {

            const member = interaction.guild.members.cache.get(user.id);
            if (!member) {
                return;
            }
            if (db.status == true && !member.roles.cache.has(db.role)) {
                await member.roles.add(db.role);
                await interaction.reply({ content: `${db.emoji} verification passer avec succes`, flags: 64 });
            }
            else if (db.status == true && member.roles.cache.has(db.role)) {
                return;
            }
            else if (db.status == false) {
                await interaction.reply({ content: `${db.emoji} Le systeme de verif est actuellement desactiver`, flags: 64 });
            }
        }

    }
}