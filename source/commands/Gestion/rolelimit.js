import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, StringSelectMenuBuilder } from 'discord.js';

export default {
    name: "rolelimit",
    category: "Gestion",
    description: "Permet de configurer le rolelimit",
    run: async (client, message, args) => {
        const isOwn = await client.db.oneOrNone(
            `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
            [message.author.id]
        );
        if (!isOwn) {
            return message.reply({
                content: "Vous n'avez pas la permission d'utiliser cette commande",
            });
        }

        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || await message.guild.roles.fetch(args[0]).catch(()=> {});

        if (!role) {
            return message.reply({
                content: "Veuillez preciser le role",
            });
        } else {

            const data = await client.data.get(`rolelimit_${message.guild.id}_${role.id}`) || {
                limit: 0
            }

        //     limit options menu
            const limitOptions = Array.from({ length: 20 }, (_, i) => ({
                label: `${i + 1}`,
                value: `${i + 1}`,
            }));

            const menu = new StringSelectMenuBuilder()
                .setCustomId("limit" + message.id)
                .setPlaceholder("Choisissez une limite")
                .addOptions([{
                    label: '1',
                    value: '1',
                }, {
                    label: '2',
                    value: '2',
                }, {
                    label: '3',
                    value: '3',
                }, {
                    label: '4',
                    value: '4',
                }, {
                    label: '5',
                    value: '5',
                }, {
                    label: '6',
                    value: '6',
                }, {
                    label: '7',
                    value: '7',
                }, {
                    label: '8',
                    value: '8',
                }, {
                    label: '9',
                    value: '9',
                }, {
                    label: '10',
                    value: '10',
                }]);

            // menu2 to 20
            const menu2 = new StringSelectMenuBuilder()
                .setCustomId("limit2" + message.id)
                .setPlaceholder("Choisissez une limite")
                .addOptions([{
                    label: '11',
                    value: '11',
                }, {
                    label: '12',
                    value: '12',
                }, {
                    label: '13',
                    value: '13',
                }, {
                    label: '14',
                    value: '14',
                }, {
                    label: '15',
                    value: '15',
                }, {
                    label: '16',
                    value: '16',
                }, {
                    label: '17',
                    value: '17',
                }, {
                    label: '18',
                    value: '18',
                }, {
                    label: '19',
                    value: '9',
                }, {
                    label: '20',
                    value: '20',
                }]);

            const menu3 = new StringSelectMenuBuilder()
                .setCustomId("limit3" + message.id)
                .setPlaceholder("Choisissez une limite")
                .addOptions([{
                    label: '21',
                    value: '21',
                }, {
                    label: '22',
                    value: '22',
                }, {
                    label: '23',
                    value: '23',
                }, {
                    label: '24',
                    value: '24',
                }, {
                    label: '25',
                    value: '25',
                }]);

            const reset =  new ButtonBuilder()
                .setCustomId("reset" + message.id)
                .setLabel("Reinitialiser")
                .setStyle(4)

            const menu1row = new ActionRowBuilder()
                .addComponents(menu);

            const menu2row = new ActionRowBuilder()
                .addComponents(menu2);

            const menu3row = new ActionRowBuilder()
                .addComponents(menu3);

            const row2 = new ActionRowBuilder()
                .addComponents(reset);

            await message.reply({ embeds: [{
                title: `Rolelimit de ${role.name}`,
                description: `Veuillez selectionner une limite`,
                color: parseInt(client.color.replace('#', ''), 16),
                footer: client.config.footer,
                timestamp: new Date()
                }], components: [menu1row, menu2row, menu3row, row2] });

            const filter = (i) => i.user.id === message.author.id;

            const collector = message.channel.createMessageComponentCollector({
                filter,
                time: 60000
            });

            collector.on("collect", async (i) => {

                if (i.customId === "reset" + message.id) {
                    await client.data.delete(`rolelimit_${message.guild.id}_${role.id}`);
                    // Fetch the original role name
                    let originalRoleName = client.data.get(`originalRoleName_${message.guild.id}_${role.id}`) || role.name;
                    // Set the role name back to the original name
                    await role.edit({ name: originalRoleName });
                    await client.data.delete(`originalRoleName_${message.guild.id}_${role.id}`);
                    i.reply({ content: `Le rolelimit de ${role} a bien ete reinitialise` , ephemeral: true });
                } else if (i.customId === "limit" + message.id) {
                    let db = client.data.get(`rolelimit_${message.guild.id}_${role.id}`) || {
                        limit: 0
                    };

                    db.limit = i.values[0];

                    client.data.set(`rolelimit_${message.guild.id}_${role.id}`, db);
// Store the original role name
                    client.data.set(`originalRoleName_${message.guild.id}_${role.id}`, role.name);

                    const memberCount = message.guild.members.cache.filter(member => member.roles.cache.has(role.id)).size;

                    // Rename the role to include the member count
                    const newName = `${role.name} [${memberCount}/${db.limit}]`;
                    await role.edit({ name: newName });

                   i.reply({ content: `Le rolelimit de ${role} a bien ete mis a ${i.values[0]}` , ephemeral: true });
                }

        });

            }

    }
}
