import { ActionRowBuilder, BaseGuildTextChannel, ButtonBuilder, ButtonInteraction, CacheType, Client, EmbedBuilder, TextBasedChannel } from 'discord.js';

import discordTranscripts from 'discord-html-transcripts';

export default {
    name: "interactionCreate",
    run: async (client: Client, interaction: ButtonInteraction<CacheType>) => {
        if (!interaction.isButton()) return;
        const color = await parseInt(client.color.replace('#', ''), 16);
        const dbserveur = await client?.data2.get(`ticket_${interaction.guild?.id}`)
        const buttonId = interaction.customId;
        const userId = interaction.user.id;

        if (buttonId.startsWith('claim_')) {
            const ticketId = buttonId.split('_')[1];
            console.log(ticketId);
            const tickets = await client.data2.get(`ticket_user_${interaction.guild?.id}`);
            const resul = tickets.find((ticket: any) => ticket.id === ticketId);
            console.log(resul.id);
            if (resul.author === userId) {
                return interaction.reply({ content: 'Vous ne pouvez pas claim votre propre ticket !', flags: 64 })
            }
            resul.claim = userId;
            const ticketupdate = tickets.map((ticket: any) => (ticket.id === ticketId ? resul : ticket));
            await client.data2.set(`ticket_user_${interaction.guild?.id}`, ticketupdate);

            const button = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('close_' + resul.id)
                        .setLabel('Fermer le ticket')
                        .setStyle(4)
                        .setEmoji('🔒'),
                    new ButtonBuilder()
                        .setLabel('Claim par ' + interaction?.user.username)
                        .setStyle(2)
                        .setDisabled(true)
                        .setEmoji('🔐')
                        .setCustomId("claim_" + resul.id)
                );

            return interaction.update({
                components: [button]
            });
        }


        if (buttonId.startsWith('close_')) {
            const ticketId = buttonId.split('_')[1];
            const tickets = await client.data2.get(`ticket_user_${interaction.guild?.id}`);
            const resul = tickets.find((ticket: any) => ticket.id === ticketId);
            if (!resul) return;
            console.log(resul)
            const user = await client.users.fetch(resul.author);
            const usercache = client.users.cache.get(resul.author);
            if (!dbserveur) return;
            const dboption = dbserveur.option.find((option: any) => option.value === resul.option);

            const channel = interaction.guild?.channels.cache.get(dboption.logs);
            const channelticket = interaction.guild?.channels.cache.get(interaction.channel?.id as string);
            const attachment = await discordTranscripts.createTranscript(channelticket as TextBasedChannel);
            if (channel) {
                const embed = new EmbedBuilder()
                    .setColor(color)
                    .setFooter(client.config.footer)
                    .setAuthor(
                        {
                            name: user.username + ' ' + (await user).id,
                            iconURL: user.avatarURL({ size: 1024, forceStatic: false }) as string
                        })
                    .setTimestamp()
                    .setTitle('Ticket Fermé par ' + interaction.user.username);

                (channel as BaseGuildTextChannel).send({
                    files: [attachment],
                    embeds: [embed]
                }).catch(() => { })
            }
            if (dbserveur.transcript) {
                if (usercache) {
                    usercache.send({
                        content: `Votre ticket sur le serveur ${interaction.guild?.name} à été fermé\nVoici un transcript du ticket`,
                        files: [attachment],
                    }).catch(() => { })
                }

            }
            const ticketupdate = tickets.filter((ticket: any) => ticket.id !== ticketId);
            await client.data2.set(`ticket_user_${interaction.guild?.id}`, ticketupdate);
            await channelticket?.delete();
        }
    }
};