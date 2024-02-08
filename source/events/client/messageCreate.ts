import { EmbedBuilder, Client, Message, BaseGuildTextChannel, ChannelType } from "discord.js";

export default {
  name: "messageCreate",
  run: async (client: Client, message: Message) => {
    console.log(message)

    if (message.author.bot || message.channel.type === ChannelType.DM) return;

    let prefix;
    const result = await client.db.oneOrNone(
      `SELECT prefix FROM clarity_${client.user?.id}_${message.guild?.id}`
    );

    if (!result) {
      prefix = client.config.prefix;
    } else {
      prefix = result.prefix;
    }
    client.prefix = prefix;

    if (
      message.content === `<@${client.user?.id}>` ||
      message.content === `<@!${client.user?.id}>`
    ) {
      let prefE = new EmbedBuilder()
        .setDescription(`Mon prefix est: \`${prefix}\``)
        .setColor(client.config.default_color)
        .setFooter(client.config.footer);
      return message.reply({ embeds: [prefE] }).catch(() => { });
    }

    if (!message.content.startsWith(prefix) || message.content === prefix || message.content.startsWith(prefix + ' ')) {
      if (!message.content.startsWith(`<@${client.user?.id}>`) && !message.content.startsWith(`<@!${client.user?.id}>`)) {
        return;
      }
    }
    const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^(<@!?${client.user?.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const matchResult = message.content.match(prefixRegex);
    if (!matchResult) return;
    const [, matchedPrefix] = matchResult;

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
    const commandName = args.shift()?.toLowerCase().normalize();
    if (!commandName) return;

    try {
      const isBlCmd = await client.data.get(`blcmd_${message.guild?.id}`) || {
        users: []
      }
      if (!isBlCmd) return;
      if (isBlCmd.users.includes(message.author.id)) {
        return message.reply({
          embeds: [{
            color: parseInt(client.color.replace('#', ''), 16),
            description: "Vous êtes bloqué de l'utilisation des commandes, elles ne vous sont plus accessibles.",
            footer: {
              text: client.config.footer
            },
            timestamp: new Date().getTime() as unknown as string,
            thumbnail: {
              url: message.author.displayAvatarURL({ forceStatic: false })
            },
            author: {
              name: message.author.username,
              icon_url: message.author.displayAvatarURL({ forceStatic: false }) as string
            }
          }]
        });
      }
    } catch (error) {
      console.error(error);
    }

    try {
      const commanddbd = await client.data.get(`commandlogs_${message.guild?.id}`)
      const logC = message.guild?.channels.cache.get(commanddbd) as BaseGuildTextChannel | undefined;

      if (logC) {
        const cmd = client.commands.get(commandName) || client.aliases.get(commandName);
        if (cmd && message.content.startsWith(prefix)) {
          (logC as BaseGuildTextChannel).send({
            embeds: [{
              color: parseInt(client.color.replace('#', ''), 16),
              timestamp: new Date().getTime() as unknown as string,
              thumbnail: {
                url: message.author.displayAvatarURL({ forceStatic: false })
              },
              author: {
                name: message.author.username,
                icon_url: message.author.displayAvatarURL({ forceStatic: false })
              },
              description: `${message.author.username} vient d'executer une commande `,
              fields: [{
                name: "Commande",
                value: commandName
              }, {
                name: "Executer dans le channel",
                value: `${message.channel.name}`
              }]
            }]
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
    try {
      const data = await client.data2.get(`nocmd_${message.guild?.id}`) || {
        channels: []
      }
      if (!data) return;

      if (data.channels.includes(message.channel.id)) {
        if (!client.config.devs.includes(message.author.id)) {
          return message.reply({
            content: "Les commandes ont été désactivées dans ce salon.",
          });
        }
        if (message.author.id != client.config.buyer) {
          return message.reply({
            content: "Les commandes ont été désactivées dans ce salon.",
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
    const cmd = client.commands.get(commandName) || client.aliases.get(commandName);
    if (!cmd) return;
    cmd.run(client, message, args);

  },
};
