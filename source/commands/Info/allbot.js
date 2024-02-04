const Discord = require('discord.js');
const Clarity = require('../../structures/client/index');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, PermissionsBitField, PermissionOverwrites, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'allbot', 
   category: "💻〢Informations",
    /**
     * 
     * @param {Clarity} client 
     * @param {Discord.Message} message
     */
    run: async (client, message) => {
     let color = client.color
     const adminMembers = message.guild.members.cache.filter((member) => member.user.bot);
    
     if (!adminMembers.size) return message.reply({embeds: [{
        description: `Aucun Bot !`,
        title: "Bots Liste",
        color: color,
        footer: client.config.footer
    }]});
 
     const pages = 10;
     const pageCount = Math.ceil(adminMembers.size / pages);
     let currentPage = 1;
     const msg = await message.reply(`Recherche en cours...`);
 
     const sendAdminList = async () => {
       const start = (currentPage - 1) * pages;
       const end = start + pages;
       const adminList = adminMembers
         .map((member) => `[\`${member.user.tag}\`](https://discord.com/users/${member.user.id}) | (\`${member.user.id}\`)`)
         .slice(start, end)
         .join('\n');
 
       const embed = new EmbedBuilder()
         .setTitle(`List des Botss de ${message.guild.name}`)
         .setDescription(adminList)
         .setColor(client.color)
         .setFooter({ text: `Page ${currentPage}/${pageCount}` });
 
         const row = new ActionRowBuilder().addComponents(
             new ButtonBuilder()
               .setCustomId(`avant_${message.id}`)
               .setLabel('<<<')
               .setStyle(ButtonStyle.Secondary)
               .setDisabled(currentPage === 1),
             new ButtonBuilder()
               .setCustomId(`suivant_${message.id}`)
               .setLabel('>>>')
               .setStyle(ButtonStyle.Secondary)
               .setDisabled(currentPage === pageCount)
           );
     
           await msg.edit({
             embeds: [embed],
             content: null,
             components: [row],
           });
         };
     
         await sendAdminList();
     
         const collector = msg.createMessageComponentCollector({
           componentType: ComponentType.Button,
           time: 60000,
         });
     
         collector.on('collect', async (button) => {
           if (button.user.id !== message.author.id) {
             return button.reply({ content: await client.lang('noperminterac'), ephemeral: true });
           }
           if (button.customId === `avant_${message.id}` && currentPage > 1) {
             currentPage--;
             button.deferUpdate()          
           } else if (button.customId === `suivant_${message.id}` && currentPage < pageCount) {
             currentPage++;
             button.deferUpdate()          
           }
     
     
           await sendAdminList();
         });
     
         collector.on('end', () => {
           msg.edit({ components: [] });
         });

    
    }
}
