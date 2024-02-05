import {
    BaseGuildTextChannel,
    Client,
    Message,
    Role,
    GuildChannel,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ChannelType
} from "discord.js";

export default {
    name: "afk",
    aliases: [],
    description: "AFK",
    category: "🤖〢Bot",
    run: async (client: Client, message: Message, args: string[]) => {
        if (!message.guild || !client.user) return;
        try {
            await client.db.none(`
        CREATE TABLE IF NOT EXISTS clarity_afk (
          user_id VARCHAR(20) PRIMARY KEY,
          raison TEXT
        )
      `);
            let raison = await args.join(" ");
            await client.db.none(
                `INSERT INTO clarity_afk (user_id, raison) VALUES (\$1, \$2)`,
                [message.author.id, raison]
            );

            const afkEmb = new EmbedBuilder()
                .setTitle(`AFK - SYSTEM`)
                .setDescription(`Vous etes maintenant AFK. Les autres utilisateurs seront informés de votre statut lorsque vous serez mentionné.`)
                .addFields({
                    name: "Raison",
                    value: raison ? raison : "Indisponible pour le moment"
                })
                .setImage(
                    message.author.displayAvatarURL({ forceStatic: false })
                )
                .setColor(parseInt(client.color.replace("#", ""), 16))
                .setFooter({
                    text: client.config.footer.text
                })
            message.channel.send({
                embeds: [afkEmb]
            });
        } catch (e: any) {
            console.log(e)
        }
    }
}