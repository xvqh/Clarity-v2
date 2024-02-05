import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, AttachmentBuilder } from 'discord.js';

export default {
    name: "massrename",
    aliases: ["massrename"],
    category: "👀〢Fun",
    run: async (client, message, args) => {
        // Check if the user has the necessary permissions to use the command
        const isOwn = await client.db.oneOrNone(
            `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
            [message.author.id]
        );
        if (!isOwn) {
            return message.reply({
                content: "Vous n'avez pas la permission d'utiliser cette commande",
            });
        }

        // Get the mentioned member
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        // if the user is in the dev array of config files then return an message
        if (client.config.devs.includes(member.id)) {
            return message.reply({
                content: "Vous ne pouvez pas renommer un membre contribuant au developpement du bot",
            });
        }
        if (!member) {
            return message.reply({
                content: "Veuillez mentionner un membre à renommer",
            });
        }

        // Configuration for the name generator
        const config = {
            dictionaries: [adjectives, animals],
            separator: '-',
        };
        const initialNickname = member.nickname || member.user.username;
        // Specify the number of times to rename the member
        const numRenames = args[1] ? parseInt(args[1], 10) : 5; // Default to 5 if no argument is provided

        let count = 0;
        // Initialize a counter for the number of times the member has been renamed
        let renamedNames = [];

        // Loop to rename the member the specified number of times
        for (let i = 0; i < numRenames; i++) {
            const newName = uniqueNamesGenerator(config);
            await member.setNickname(newName);
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait half a second between renames
            renamedNames.push(newName); // Add the name to the array
            count++;
        }

        // Restore the initial nickname
        await member.setNickname(initialNickname);

        // Create a string from the renamedNames array
        const renamedNamesString = renamedNames.join('\n');

        // Create a buffer from the string
        const buffer = Buffer.from(renamedNamesString);

        // Create an attachment from the buffer
        const attachment = new AttachmentBuilder(buffer, 'names.txt');

        // Create an embed message indicating that the member has been renamed
        const embed = new EmbedBuilder()
            .setTitle(`Membre renommé ${count} fois`)
            .setDescription(`Le membre ${member} a été renommé ${count} fois`)
            .addFields({
                name: 'Noms utilisés',
                value: `\`\`\`${renamedNamesString}\`\`\``
            })
            .setColor(parseInt(client.color.replace("#", ""), 16))
            .setFooter({ text: `Demande par ${message.author.tag} || ` + client.config.footer.text, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()

        // Send the embed message
        message.reply({ embeds: [embed] });
    }
}
