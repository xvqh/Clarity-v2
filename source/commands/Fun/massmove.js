import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, AttachmentBuilder } from 'discord.js';

export default {
    name: "massmove",
    aliases: ["massmove"],
    category: "👀〢Fun",
    run: async(client, message, args) => {
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
                content: "Vous ne pouvez pas moove un membre contribuant au developpement du bot",
            });
        }
        if (!member) {
            return message.reply({
                content: "Veuillez mentionner un membre à déplacer",
            });
        }

        // Save the original voice channel
        const originalChannel = member.voice.channel;

        // Get all voice channels in the guild
        const voiceChannels = message.guild.channels.cache.filter(channel => channel.type === 2);

        // Specify the number of channels to move the member through
        const numChannels = args[1] ? parseInt(args[1], 10) : voiceChannels.size;

        let count = 0;
        // Initialize a counter for the number of channels the member has been moved to
        let movedChannels = [];

        // Loop through each voice channel and move the member
        for (const channel of voiceChannels.values()) {
            if (count >= numChannels) break;
            if (member.voice.channelId !== channel.id) {
                await member.voice.setChannel(channel);
                await new Promise(resolve => setTimeout(resolve, 500)); // Wait half a second between moves
                movedChannels.push(channel.name); // Add the channel name to the array
                count++;
            }
        }

        // Move the member back to the original channel
        await member.voice.setChannel(originalChannel);
        // Create a string from the movedChannels array
        const movedChannelsString = movedChannels.join('\n');

        // Create a buffer from the string
        const buffer = Buffer.from(movedChannelsString);

        // Create an attachment from the buffer
        const attachment = new AttachmentBuilder(buffer, 'channels.txt');

    //     embed message indicating that the member has been moved back
     const embed = new EmbedBuilder()
     .setTitle(`Membre déplacé à travers ${numChannels} canaux depuis ${originalChannel.name}`)
     .setDescription(`Le membre ${member} a été déplacé à travers ${count} canaux avant d'être déplacé de nouveau dans ${originalChannel}`)
         .addFields({
             name: 'Canaux déplacés',
             value: `\`\`\`${movedChannelsString}\`\`\``
         })
     .setColor(parseInt(client.color.replace("#", ""), 16))
     .setFooter({ text: `Demande par ${message.author.tag} || ` + client.config.footer.text, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
     .setTimestamp()

     //    attachment with all channel where the member has been moved

     message.reply({ embeds: [embed]});
    }
}
