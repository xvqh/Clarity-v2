const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
let partnerAskNum = 0
module.exports = {
    name: "interactionCreate",
    run: async(client, interaction) => {
        if (!interaction.isButton() && !interaction.isModalSubmit()) return;
        if(interaction.customId.startsWith("partnerask")) {
                const modal = new ModalBuilder()
                    .setCustomId('new_partner')
                    .setTitle('Demande de partenariat')
            const partnerName = new TextInputBuilder()
                .setCustomId('partnerName')
                .setLabel('Quel est votre projet pour le partenariat ?')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                const partnerInput = new TextInputBuilder()
                    .setCustomId('partnerInput')
                    .setLabel('Description de votre projet')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                const partnerLinkInput = new TextInputBuilder()
                    .setCustomId('partnerLinkInput')
                    .setLabel('Quel est votre lien pour le partenariat ? (non obligatoire)')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const partnerBannerLinkInput = new TextInputBuilder()
                .setCustomId('partnerBannerLinkInput')
                .setLabel('Quel est votre image pour le partenariat ?')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
          


            const nameRow = new ActionRowBuilder().addComponents(partnerName)
                const descRow = new ActionRowBuilder().addComponents(partnerInput)
                const linkRow = new ActionRowBuilder().addComponents(partnerLinkInput)
                const bannerRow = new ActionRowBuilder().addComponents(partnerBannerLinkInput)
            modal.addComponents(nameRow, descRow, linkRow, bannerRow)
            await interaction.showModal(modal)
        }
        if (interaction.customId.startsWith('new_partner')) {
            interaction.deferUpdate()
            const partnerName = interaction.fields.getTextInputValue('partnerName')
            const partner = interaction.fields.getTextInputValue('partnerInput')
            const partnerLink = interaction.fields.getTextInputValue('partnerLinkInput')
            let channel = client.channels.cache.get(client.data.get(`partnerwait_${interaction.guild.id}`))
            // add +1 to the partnerAskNum variable
            partnerAskNum++
            let num = partnerAskNum
            channel.send({ embeds: [{
                title: 'Nouvelle demande de partenariat',
                description: 'Une nouvelle demande de partenariat vient d\'étre soumise',
                    color: parseInt(client.color.replace("#", ""), 16),
                fields: [{
                    name: 'Nom du demandeur',
                    value: `${interaction.user.username}`,
                }, {
                    name: 'ID du demandeur',
                    value: `${interaction.user.id}`,
                },{
                    name: 'Nom Projet',
                    value: `${partnerName}`,
                }, {
                    name: 'Description Projet',
                    value: `${partner}`,
                }],
                footer: {
                    text: `Demande n°${num}` + ' | ' + client.config.footer.text,
                }
                }] })
            channel.send({ content: `${partnerLink? `Lien du projet : ${partnerLink}` : ''}`})
            channel.send({ content: `${partnerBannerLink? `Image du projet : ${partnerBanner}` : ''}`})
        }
    }
}