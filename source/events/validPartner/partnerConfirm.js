import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } from 'discord.js';
let partnerNum = 0;

export default {
    name: "interactionCreate",
    run: async (client, interaction) => {
        if (!interaction.isButton() && !interaction.isModalSubmit()) return;
        if (interaction.customId.startsWith('partner_accept')) {
            const modal = new ModalBuilder()
                .setCustomId('partner_yes')
                .setTitle('Confirmation de demande de partenariat')
            const partnerName = new TextInputBuilder()
                .setCustomId('partnerName')
                .setLabel('Nom du projet')
                .setStyle(TextInputStyle.Short)
            const partnerInput = new TextInputBuilder()
                .setCustomId('partnerInputt')
                .setLabel('Description du projet')
                .setStyle(TextInputStyle.Paragraph)
            const partnerLinkInput = new TextInputBuilder()
                .setCustomId('partnerLinkInputt')
                .setLabel('Lien du projet')
                .setStyle(TextInputStyle.Short)
            const partnerBannerLinkInput = new TextInputBuilder()
                .setCustomId('partnerBannerLinkInput')
                .setLabel('Image pour le partenariat ? (non obligatoire)')
                .setStyle(TextInputStyle.Short)
            const partnerId = new TextInputBuilder()
                .setCustomId('partnerId')
                .setLabel('ID du demandeur')
                .setStyle(TextInputStyle.Short)

            const NameRoww = new ActionRowBuilder().addComponents(partnerName)
            const descRoww = new ActionRowBuilder().addComponents(partnerInput)
            const linkRoww = new ActionRowBuilder().addComponents(partnerLinkInput)
            const bannerRow = new ActionRowBuilder().addComponents(partnerBannerLinkInput)
            const idRow = new ActionRowBuilder().addComponents(partnerId)
            modal.addComponents(NameRoww, descRoww, linkRoww, bannerRow, idRow)
            await interaction.showModal(modal)
        }
        if (interaction.customId.startsWith('partner_yes')) {
            interaction.deferUpdate();
            let db = await client.data.get(`partnerdata_${interaction.guild.id}`) || {
                partrole: [],
                notifrole: []
            }
            const partname = interaction.fields.getTextInputValue('partnerName')
            const partner = interaction.fields.getTextInputValue('partnerInputt')
            const partnerLink = interaction.fields.getTextInputValue('partnerLinkInputt')
            const Bannerlink = interaction.fields.getTextInputValue("partnerBannerLinkInput")
            const partnerId = interaction.fields.getTextInputValue('partnerId')
            let channel = client.channels.cache.get(client.data.get(`partnerlog_${interaction.guild.id}`))
            let partrole = db.partrole;
            let notif = db.notifrole.map((r) => interaction.guild.roles.cache.get(r).toString()).join(", ")
            partnerNum++
            let num = partnerNum
            // get the servpartnernum
            let serverPartnum = client.data.get(`servpartnernum_${interaction.guild.id}`);
            // add 1 value to the data with add method
            client.data.add(`servpartnernum_${interaction.guild.id}`, 1)
            // get the member who made the partner
            let user = interaction.member.user
            // get the db of realised partner of the user
            let userdb = client.data.get(`userpartner_${interaction.guild.id}`);
            // add  1 value to 1 userpartner
            client.data.add(`userpartner_${interaction.guild.id}`, 1)

            await channel.send({
                content: `${notif ? notif : "@everyone"}`, embeds: [{
                    title: 'Nouveau Partenariat',
                    description: 'Un nouveau partenariat a ete accepte',
                    color: parseInt(client.color.replace("#", ""), 16),
                    fields: [{
                        name: 'Nom Projet',
                        value: `${partname}`,
                    }, {
                        name: 'Description Projet',
                        value: `${partner}`,
                    }, {
                        name: 'Demander par',
                        value: `<@${partnerId}>`,
                    }
                    ],
                    footer: {
                        text: `Partenariat n°${serverPartnum}` + ' | ' + client.config.footer.text,
                    }
                }, {
                    author: {
                        name: user.username,
                        iconURL: user.displayAvatarURL()
                    },
                    description: "Partenariat réalisé par " + user,
                    fields: [{
                        name: 'ID de l\'utilisateur',
                        value: `${user.id}`
                    }, {
                        name: 'Nombre de partenariats réalisés',
                        value: `${userdb || 0}`
                    }],
                    timestamp: new Date(),
                    color: parseInt(client.color.replace("#", ""), 16),
                    footer: {
                        text: `Partenariat n°${serverPartnum}` + ' | ' + client.config.footer.text,
                    }
                }]
            })
            await channel.send({ content: `${partnerLink ? `Lien du projet : ${partnerLink}` : ''}` })
            await channel.send({ content: `${Bannerlink ? `Image du projet : ${Bannerlink}` : ''}` })
            partrole.forEach(roleId => {
                const member = interaction.guild.members.cache.get(partnerId)
                member.roles.add(roleId)
            })

        }
    }
}