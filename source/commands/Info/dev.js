import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder } from "discord.js";
import moment from "moment";

export default {
    name: "devs",
    aliases: ["devs"],
    category: "💻〢Informations",
    description: "Get list of developers",
    utilisation: "{prefix}devs",

    run: async (client, message, args) => {
        const devs = await client.config.devs || [];
        // create a StringSelectMenu with the devs for get info of any dev
        const devsMenu = new StringSelectMenuBuilder()
            .setCustomId("devs" + message.id)
            .setPlaceholder("Choisissez un developpeur")
            .addOptions(
                devs.map((dev) => {
                    return {

                        label: `${client.users.cache.get(dev)?.username}` || dev,
                        value: `${dev}`
                    }
                })
            )

        const row = new ActionRowBuilder()
            .addComponents(
                devsMenu
            )
        const embed = new EmbedBuilder()
            .setTitle(client.user.username + " Developpeurs")
            .setDescription("Choisissez un developpeur")
            .setColor(parseInt(client.color.replace("#", ""), 16))
            .setFooter({
                text: client.config.footer.text
            })
            .setTimestamp();

        let msg = await message.channel.send({ embeds: [embed], components: [row] })

        const filter = (i) => i.user.id === message.author.id;


        const collector = msg.createMessageComponentCollector({
            filter,
            time: 30000 * 10 * 3
        })

        collector.on("collect", async (i) => {
            if (!i.isStringSelectMenu() || i.customId !== "devs" + message.id) return;

            const dev = devs.find((d) => d === i.values[0]);
            if (!dev) return i.deferUpdate().catch(() => { });

            const devUser = await client.users.fetch(dev);

            const fields = [
                { name: "Nom d'affichage", value: devUser.displayName },
                { name: "Nom d'utilisateur", value: devUser.username },
                { name: "ID", value: devUser.id },
                { name: "Avatar", value: `[Cliquez ici](${devUser.displayAvatarURL({ dynamic: true })})` },
                { name: "Compte cree le", value: moment(devUser.createdAt).format("DD/MM/YYYY") }
            ];

            const embed = new EmbedBuilder()
                .setTitle(client.user.username + " Developpeurs")
                .addFields(...fields)
                .setColor(parseInt(client.color.replace("#", ""), 16))
                .setFooter({ text: client.config.footer.text })
                .setTimestamp()
                .setAuthor({ name: devUser.username, iconURL: devUser.displayAvatarURL({ dynamic: true }) });

            await i.update({ embeds: [embed] });
        });



    }
}
