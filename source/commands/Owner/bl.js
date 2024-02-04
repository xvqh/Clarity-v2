const { EmbedBuilder , ActionRowBuilder, ButtonBuilder} = require('discord.js')
module.exports = {
    name: 'blacklist',
    aliases: ['bl'],
    run: async(client , message, args) => {
        const isBuy = await client.functions.isBuy(client, message.author.id);
        if (!isBuy) {
            return message.reply({
                content: "Vous n'avez pas la permission d'utiliser cette commande",
            });
        }
        const db = client.data2.get(`blacklist_${client.user.id}`) || {
            users: [],
            authors: [],
            date: new Date().toISOString(),
            reason: null
        }
        let user = message.mentions.users.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => null);
        let reason = args.slice(1).join(" ") || `blacklisted by ${message.author.username}`;

        if (!user) {
            //     return an embed with the list of blacklisted users with pagination system

            let currentPage = 1
            const pageCount = Math.ceil(db.users.length / 10)

            const embed = new EmbedBuilder()
                .setTitle('Liste des utilisateurs blacklist')
                .setColor(parseInt(client.color.replace("#", ""), 16))
                .setFooter({ text: `Page ${currentPage}/${Math.ceil(db.users.length / 10)} ` + client.config.footer.text})
                .setTimestamp()
            for (let i = 0; i < db.users.length; i++) {
                if (i > 9) break
                embed.addFields({ name: `${i + 1}. ${client.users.cache.get(db.users[i])?.displayName}`, value: `ID: ${db.users[i]}` })
            }
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('previous')
                        .setLabel('<<')
                        .setStyle(2)
                        .setDisabled(currentPage === 1),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('>>')
                        .setStyle(2)
                        .setDisabled(currentPage === pageCount ? currentPage === pageCount : currentPage === 1)
                )
            await message.reply({ embeds: [embed], components: [row] })

            //     collector
            const filter = (i) => i.user.id === message.author.id

            const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 })
            collector.on('collect', async i => {
                if (i.customId === 'next') {
                    currentPage++
                    const embed = new EmbedBuilder()
                        .setTitle('Liste des utilisateurs blacklist')
                        .setColor(parseInt(client.color.replace("#", ""), 16))
                        .setFooter({ text: `Page ${currentPage}/${Math.ceil(db.users.length / 10)} ` + client.config.footer.text})
                        .setTimestamp()
                    for (let i = 0; i < db.users.length; i++) {
                        if (i > (currentPage - 1) * 10) break
                        embed.addFields({ name: `${i + 1}. ${client.users.cache.get(db.users[i])?.displayName}`, value: `ID: ${db.users[i]}` })
                    }
                    await i.update({ embeds: [embed], components: [row] })
                }
                if (i.customId === 'previous') {
                    currentPage--
                    const embed = new EmbedBuilder()
                        .setTitle('Liste des utilisateurs blacklist')
                        .setColor(parseInt(client.color.replace("#", ""), 16))
                        .setFooter({ text: `Page ${currentPage}/${Math.ceil(db.users.length / 10)} ` + client.config.footer.text})
                        .setTimestamp()
                    for (let i = 0; i < db.users.length; i++) {
                        if (i > (currentPage - 1) * 10) break
                        embed.addFields({ name: `${i + 1}. ${client.users.cache.get(db.users[i])?.displayName}`, value: `ID: ${db.users[i]}` })
                    }
                    await i.update({ embeds: [embed], components: [row] })
                }
            })
        }
        if (user) {
            if (db.users.includes(user.id)) return message.reply({ content: `Cet utilisateur est deja dans la liste blacklist` })
            db.users.push(user.id)
            db.authors.push(message.author.id)
            db.date = new Date
            db.reason = reason
            client.data2.set(`blacklist_${client.user.id}`, db)
            const success = new EmbedBuilder()
                .setColor(parseInt(client.color.replace("#", ""), 16))
                .setDescription(`L'utilisateur ${user.username} est maintenant blacklist\nBanni de **${client.guilds.cache.size}** serveur(s).`)
                .addFields({
                    name: 'Raison',
                    value: `${db.reason}`
                }, {
                    name: 'Autheur',
                    value: `${message.author.username}`
                })
                .setFooter(client.config.footer)
                .setAuthor({name: message.author.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true })})

            //  get all guilds
            const guilds = client.guilds.cache.map(guild => guild.name);
            // ban the member from all guilds
            for (const guildName of guilds) {
                const guild = client.guilds.cache.find(guild => guild.name === guildName);
                const member = guild.members.cache.get(user.id);
                if (member) {
                    member.ban({ reason: db.reason });
                }
            }
            await message.reply({ embeds: [success] , flags: 64})


        }
    }
}