const { Client, Message } = require("discord.js");
const Clarity = require("../../structures/client/index");
const { EmbedBuilder } = require("discord.js");

/**
 * @param {Client} client
 * @param {Message} message
 */
module.exports = {
  name: "messageCreate",
  run: async (client, message) => {
    if (message.author.bot) return;

    let prefix;
    const result = await client.db.oneOrNone(
      `SELECT prefix FROM clarity_${client.user.id}_${message.guild.id}`
    );
    if (!result) {
      prefix = client.config.prefix;
    } else {
      prefix = result.prefix;
    }
    client.prefix = prefix;

    const color = await client.db.oneOrNone(`SELECT color FROM clarity_${client.user.id}_${message.guild.id}`);

    if (color) {
        client.color = parseInt(color.color.replace("#", ""), 16);
    } else {
        client.color = parseInt(client.config.default_color.replace("#", ""), 16);
    }

    if (
      message.content === `<@${client.user.id}>` ||
      message.content === `<@!${client.user.id}>`
    ) {
      let prefE = new EmbedBuilder()
        .setDescription(`Mon prefix est: \`${prefix}\``)
        .setColor(client.config.default_color)
        .setFooter(client.config.footer);
      return message.reply({ embeds: [prefE] }).catch(() => {});
    }

    if (!message.content.startsWith(prefix) || message.content === prefix || message.content.startsWith(prefix + ' ')) {
      if (!message.content.startsWith(`<@${client.user.id}>`) && !message.content.startsWith(`<@!${client.user.id}>`)) {
        return;
      }
    }
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
    const commandName = args.shift()?.toLowerCase().normalize();
    if (!commandName) return;

    try {
      const isBlCmd = await client.db.oneOrNone(
        `SELECT 1 FROM clarity_${client.user.id}_blacklistcmd WHERE user_id = \$1`,
        [message.author.id]
      );
      if (isBlCmd) {
        return message.reply({
          content:
            "Vous êtes bloqué de l'utilisation des commandes, elles ne vous sont plus accessibles.",
        });
      }
    } catch (error) {
      console.error(error);
    }

    try {
      const commanddbd = await client.db.oneOrNone(`
        SELECT commandlog
        FROM clarity_${client.user.id}_${message.guild.id}_logs
      `);

      if (commanddbd && commanddbd.commandlog) {
        const commandlogChannel = message.guild.channels.cache.get(
          commanddbd.commandlog
        );
        if (commandlogChannel) {
          commandlogChannel.send({
            content: `${message.author.username} vient de faire la commande ${commandName} !`,
          });
        }
      }
    } catch (error) {
    
    }

    const cmd = client.commands.get(commandName) || client.aliases.get(commandName);
    if (!cmd) return;

    cmd.run(client, message, args);
  },
};
