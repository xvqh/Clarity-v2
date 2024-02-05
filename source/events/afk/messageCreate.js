import { Client, Message } from "discord.js";

/**
 * @param {Client} client
 * @param {Message} message
 */
export default {
  name: "messageCreate",
  run: async (client, message) => {
    try {
        const tableExists = await client.db.oneOrNone(`
          SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_name = 'clarity_afk'
          )
        `);
  
        if (!tableExists.exists) {
          return;
        }
  
        const afkData = await client.db.oneOrNone(
          'SELECT * FROM clarity_afk WHERE user_id = \$1',
          message.author.id
        );
  
        if (afkData) {
          await client.db.none('DELETE FROM clarity_afk WHERE user_id = \$1', message.author.id);
          message.reply({ content: "Bon retour parmi nous ! Votre AFK vient d'être supprimé." });
        }
  
        const allAfkUsers = await client.db.any('SELECT * FROM clarity_afk');
        if (allAfkUsers.length > 0 && (message.content.includes('@everyone') || message.content.includes('@here'))) {
          message.delete()
            .then(msg => {
              console.log(`Deleted message from ${msg.author.username}`);
              message.channel.send({content: `Un message a été supprimé car il mentionnait \`everyone\` ou \`here\` alors que des utilisateurs sont AFK. Nombre D'afk : ${allAfkUsers.length}`});
            })
            .catch(console.error);
        } else {
        const mentionedUsers = message.mentions.users;
        mentionedUsers.forEach(async (user) => {
          const afkData = await client.db.oneOrNone('SELECT * FROM clarity_afk WHERE user_id = \$1', user.id);
          if (afkData) {
            message.reply({
              content: `${user.username} est actuellement AFK avec comme raison : ${afkData.raison}`,
            });
          }
        });
      } }catch (error) {
        console.error(error);
      }
  }}