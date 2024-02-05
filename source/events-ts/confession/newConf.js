import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } from 'discord.js';

let confNum = 0;
export default {
    name: 'interactionCreate',
    run: async (client, interaction) => {
        if (!interaction.isButton() && !interaction.isModalSubmit()) return;
        if (interaction.customId.startsWith('newconfess')) {
            const modal = new ModalBuilder()
                .setCustomId('confess')
                .setTitle('Votre Confession')

            const confessInput = new TextInputBuilder()
                .setCustomId('confessInput')
                .setLabel('Quel est votre confession ?')
                .setStyle(TextInputStyle.Paragraph)

            const actionRow = new ActionRowBuilder().addComponents(confessInput)

            modal.addComponents(actionRow)

            await interaction.showModal(modal)
        }

        if (interaction.customId.startsWith('confess')) {
            interaction.deferUpdate();
            const confess = interaction.fields.getTextInputValue('confessInput')
            confNum++
            let num = confNum
            let channel = client.channels.cache.get(client.data.get(`confession_${interaction.guild.id}`))
            channel.send({
                embeds: [{
                    title: 'Nouvelle Confession',
                    description: confess,
                    color: parseInt(client.color.replace("#", ""), 16),
                    footer: {
                        text: `Confession n°${num}` + ' | ' + client.user.username
                    }
                }]
            })
        }
    }
}