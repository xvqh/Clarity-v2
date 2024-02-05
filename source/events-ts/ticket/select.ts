import { StringSelectMenuOptionBuilder } from '@discordjs/builders';

import {
    APISelectMenuOption,
    ActionRowBuilder,
    ButtonBuilder,
    CacheType, Client,
    EmbedBuilder,
    OverwriteResolvable,
    PermissionFlagsBits,
    Role,
    SelectMenuComponentOptionData,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction
} from 'discord.js';

export default {
    name: "interactionCreate",
    run: async (client: Client, interaction: StringSelectMenuInteraction<CacheType>) => {
        try {
            if (!interaction.isStringSelectMenu()) return;

            if (interaction.customId === 'ticket') {
                const ticketmessage = await interaction.channel?.messages.fetch(interaction.message.id);
                await interaction.deferReply({ ephemeral: true })
                const id = interaction.values[0].split('_')[1];
                const db = await client.data2.get(`ticket_${interaction.guild?.id}`);
                if (!db) return;

                const option = db.option.find((option: any) => option.value === id);
                if (!option) return;

                const options: StringSelectMenuOptionBuilder | SelectMenuComponentOptionData | (APISelectMenuOption | StringSelectMenuOptionBuilder | SelectMenuComponentOptionData)[] | { label: any; description: any; value: string; }[] = [];
                const regex = /<:(.*):(\d+)>/;

                db.option.forEach((option: any) => {
                    const processedOption = {
                        label: option.text,
                        description: option.description,
                        value: `ticket_${option.value}`
                    };

                    if (option.emoji) {
                        const match = option.emoji.match(regex);
                        if (match) {
                            const emojiId = match[2];
                            const emoji = client.emojis.cache.get(emojiId);
                            if (emoji) {
                                processedOption.value = emojiId;
                            }
                        }
                    }

                    options.push(processedOption);
                });

                if (ticketmessage) {
                    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('ticket')
                                .addOptions(options)
                        );
                    await ticketmessage.edit({ components: [row] });
                }

                const tickeruser = await client.data2.get(`ticket_user_${interaction.guild?.id}`) || [];
                const resul = tickeruser.find((ticket: any) => ticket.author === interaction.user.id);

                if (resul && tickeruser.length >= db?.maxticket) {
                    return await interaction.editReply({ content: `Vous avez déjà atteint le nombre maximal de tickets ouverts !` });
                }

                let permissionOverwrites: OverwriteResolvable[] = [
                    {
                        id: interaction.guild?.roles.everyone as Role,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.user,
                        allow: [
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.AttachFiles,
                            PermissionFlagsBits.AddReactions,
                        ],
                    },
                ];

                if (option.access) {
                    const permissionObject = {
                        id: option.access,
                        allow: [
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.AttachFiles,
                            PermissionFlagsBits.AddReactions
                        ]
                    };
                    permissionOverwrites.push(permissionObject);
                }

                const channel = await interaction.guild?.channels.create({
                    parent: client.channels.cache.get(option.category) ? option.category : null,
                    name: option.text + '-' + interaction.user.username,
                    type: 0,
                    permissionOverwrites: permissionOverwrites,
                });

                await interaction.editReply({ content: `Ticket open <#${channel?.id}>` });

                const embed = new EmbedBuilder()
                    .setColor(parseInt(client.color.replace('#', ''), 16))
                    .setFooter(client.config.footer)
                    .setDescription(option.message)
                    .setTitle('Ticket ouvert par ' + interaction.user.username);

                const idunique = code(15);

                const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setLabel('Fermer le ticket')
                        .setStyle(4)
                        .setEmoji('🔒')
                        .setCustomId("close_" + idunique)
                );

                if (db.claimbutton) {
                    button.addComponents(
                        new ButtonBuilder()
                            .setLabel('Récupère le ticket')
                            .setStyle(2)
                            .setEmoji('🔐')
                            .setCustomId("claim_" + idunique)
                    )
                };
                
                channel?.send({
                    embeds: [embed],
                    content: (option.mention ? `<@&${option.mention}>` : null) as string,
                    components: [button]
                })
                tickeruser.push({
                    salon: channel?.id,
                    author: interaction.user.id,
                    date: Date.now(),
                    id: idunique,
                    option: option.value,
                    claim: null,
                })
                await client.data2.set(`ticket_user_${interaction.guild?.id}`, tickeruser)
            }
        } catch (error) {
            console.error(error);
            interaction.editReply({ content: 'Une erreur est survenue.' });
        }
    }
};


function code(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    return code;
}