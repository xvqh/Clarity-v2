export default {
    name: 'interactionCreate',
    run: async (client, interaction) => {

        if (!interaction.isButton()) return;

        let logs = client.data.get(`veriflogs_${interaction.guild.id}`);
        if (!logs) return;
        let chan = interaction.guild.channels.cache.get(logs);
        if (!chan) return;
        if (interaction.customId.startsWith('verif')) {
            const member = interaction.guild.members.cache.get(interaction.user.id);
            if (!member) return;

            if (chan) chan.send({
                embeds: [{
                    color: parseInt(client.color.replace("#", ""), 16),
                    author: {
                        name: interaction.user.username,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                    },
                    description: `Vérification de \`${member.user.username} (${member.id})\` effectuée avec succes`,
                    timestamp: new Date(),
                    footer: client.config.footer,
                    thumbnail: {
                        url: interaction.user.displayAvatarURL({ dynamic: true })
                    }
                }]
            })
        }

    }
}