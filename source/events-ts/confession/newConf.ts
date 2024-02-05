import {
    ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle
    , Client, Interaction, ModalSubmitInteraction, ButtonInteraction, CacheType,
    CommandInteraction,
    ModalActionRowComponentBuilder,
    BaseInteraction,
    MessageComponentInteraction,
    BaseGuildTextChannel
} from 'discord.js';

let confNum = 0;

export default {
    name: 'interactionCreate',
    run: async (client: Client, interaction: MessageComponentInteraction<CacheType>) => {

        if (!interaction.isButton() && !interaction.isModalSubmit()) return;
        if (interaction.customId.startsWith('newconfess')) {

            const modal = new ModalBuilder()
                .setCustomId('confess')
                .setTitle('Votre Confession');

            const actionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('confessInput')
                        .setLabel('Quel est votre confession ?')
                        .setStyle(TextInputStyle.Paragraph)
                );

            modal.addComponents(actionRow)

            await interaction.showModal(modal)
        }

        if (interaction.customId.startsWith('confess')) {
            interaction.deferUpdate();
            const confess = (interaction as unknown as ModalSubmitInteraction).fields.getTextInputValue('confessInput')
            confNum++
            let num = confNum
            let channel = client.channels.cache.get(client.data.get(`confession_${interaction.guild?.id}`));

            (channel as BaseGuildTextChannel).send({
                embeds: [{
                    title: 'Nouvelle Confession',
                    description: confess,
                    color: parseInt(client.color.replace("#", ""), 16),
                    footer: {
                        text: `Confession n°${num}` + ' | ' + client.user?.username
                    }
                }]
            })
        }
    }
}