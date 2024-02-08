import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export default {
    name: "confess",
    description: "Confessez-vous en utilisant cette commande!",
    aliases: ["cf", 'conf'],
    category: "Fun",
    run: async (client, message, args) => {


        let msg = await message.channel.send({content: "Chargement du menu de confession en cours . . ."})
        await update(client, message, msg)
    }
}
async function update(client, message, msg) {
    const modal = new ModalBuilder()
        .setCustomId('confess' + message.id)
        .setTitle('Votre Confession')

    const confessInput = new TextInputBuilder()
        .setCustomId('confessInput')
        .setLabel('Quel est votre confession ?')
        .setStyle(TextInputStyle.Paragraph)

    const actionRow = new ActionRowBuilder().addComponents(confessInput)

    modal.addComponents(actionRow)

    await msg.edit({
        content: null,
        embeds: [{
            title: 'Confession',
            description: 'Pour vous confessez a tout le monde, cliquez sur le bouton ci-dessous',
            color: parseInt(client.color.replace("#", ""), 16),
            footer: client.config.footer
        }],
        components: [{
            type: 1,
            components: [{
                type: 2,
                customId: 'newconfess' + message.id,
                style: 2,
                label: 'Confession',
                disabled: false,
            }]
        }]
    })
    const filter = (i) => i.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });
    collector.on('collect', async i => {
        if (i.customId === 'newconfess' + message.id) {
           msg.edit({ components: [] })
            await i.showModal(modal)
        }
    })
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId === 'confess' + message.id) {
            await interaction.reply({ content: `Confession envoyé avec succes !` , ephemeral: true })
            console.log(interaction.fields.getTextInputValue('confessInput'))
        }

    })
}