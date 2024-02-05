import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, Client, MessageComponentInteraction, CacheType, ModalSubmitInteraction, BaseGuildTextChannel, Base } from 'discord.js';

let partnerAskNum = 0;

export default {
    name: "interactionCreate",
    run: async (client: Client, interaction: MessageComponentInteraction<CacheType>) => {
        if (!interaction.isButton() && !interaction.isModalSubmit()) return;
        if (interaction.customId.startsWith("partnerask")) {

            const modal = new ModalBuilder()
                .setCustomId('new_partner')
                .setTitle('Demande de partenariat');

            const nameRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                    .setCustomId('partnerName')
                    .setLabel('Quel est votre projet pour le partenariat ?')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
            );

            const descRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                    .setCustomId('partnerInput')
                    .setLabel('Description de votre projet')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
            )
            const linkRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                    .setCustomId('partnerLinkInput')
                    .setLabel('Quel est votre lien pour le partenariat ? (non obligatoire)')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
            );

            const bannerRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                    .setCustomId('partnerBannerLinkInput')
                    .setLabel('Quel est votre image pour le partenariat ?')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)
            );

            modal.addComponents(nameRow, descRow, linkRow, bannerRow)
            await interaction.showModal(modal)
        }

        if (interaction.customId.startsWith('new_partner')) {
            interaction.deferUpdate()

            const partnerName = (interaction as unknown as ModalSubmitInteraction).fields.getTextInputValue('partnerName')
            const partner = (interaction as unknown as ModalSubmitInteraction).fields.getTextInputValue('partnerInput')
            const partnerLink = (interaction as unknown as ModalSubmitInteraction).fields.getTextInputValue('partnerLinkInput')
            let channel = client.channels.cache.get(client.data.get(`partnerwait_${interaction.guild?.id}`))
            // add +1 to the partnerAskNum variable
            partnerAskNum++
            let num = partnerAskNum;

            (channel as BaseGuildTextChannel).send({
                embeds: [{
                    title: 'Nouvelle demande de partenariat',
                    description: 'Une nouvelle demande de partenariat vient d\'étre soumise',
                    color: parseInt(client.color.replace("#", ""), 16),
                    fields: [{
                        name: 'Nom du demandeur',
                        value: `${interaction.user.username}`,
                    }, {
                        name: 'ID du demandeur',
                        value: `${interaction.user.id}`,
                    }, {
                        name: 'Nom Projet',
                        value: `${partnerName}`,
                    }, {
                        name: 'Description Projet',
                        value: `${partner}`,
                    }],
                    footer: {
                        text: `Demande n°${num}` + ' | ' + client.config.footer.text,
                    }
                }]
            });

            (channel as BaseGuildTextChannel).send({ content: `${partnerLink ? `Lien du projet : ${partnerLink}` : ''}` });
            // (channel as BaseGuildTextChannel).send({ content: `${partnerBannerLink ? `Image du projet : ${partnerBanner}` : ''}` });
        }
    }
}