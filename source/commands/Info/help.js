const Discord = require('discord.js');
const Clarity = require('../../structures/client/index');
const fs = require("fs");
const { EmbedBuilder } = require("discord.js")
module.exports = {
    name: 'help', 
    description: 'help',
    category: "💻〢Informations",
    /**
     * 
     * @param {Clarity} client 
     * @param {Discord.Message} message
     */
    run: async (client, message) => {
let color = parseInt(client.color.replace("#", ""), 16)
        const prefix = client.prefix;
        const commandFiles = fs.readdirSync('./source/commands').filter(file => file.endsWith('.js'));
        const categories = fs.readdirSync('./source/commands');
        // cree la table clarity_${client.user.id}_settings si elle n existe pas avec en valeur : helpimg , helpstyle 
        await client.db.none(`
            CREATE TABLE IF NOT EXISTS clarity_${client.user.id}_settings (
                style TEXT 
            )
        `)
        const existingStyle = await client.db.oneOrNone(`
    SELECT style FROM clarity_${client.user.id}_settings WHERE style = $1
`, ["onepage"]);
if (!existingStyle) {
    // Aucune ligne avec le style "onepage" n'existe, alors nous insérons une nouvelle ligne
    await client.db.none(`
        INSERT INTO clarity_${client.user.id}_settings (style) VALUES ($1)
    `, ["onepage"]);
}
    // recupere le style de la db et save dans style
    let style = await client.db.oneOrNone(`
        SELECT style FROM clarity_${client.user.id}_settings
    `)
        
    // faut finir le help si t es chaud MDR pcq la j ai jamais retoucher depuis comme il etait tempo faut add qu il soit auto etc
      // si le style == onepage retourne le help en une page avec les catégories ainsi que les commandes
      if (style && style.style === "onepage") {
        const commandsByCategory = {};
        client.commands.forEach((command) => {
            if (!commandsByCategory[command.category]) {
              commandsByCategory[command.category] = [];
            }
            commandsByCategory[command.category].push(command);
          });
        //   emoji des categorie
        const categoryEmojis = {
          Bot: "🤖",
          Buyer: "🛠️",
          Dev: "📚",
          Gestion: "🔨",
          Info: "💻",
          Logs: "📄",
          Mod: "📝",
          Owner: "⚙️",
          Fun: ""
        };
          let embed = new EmbedBuilder();
          embed.setColor(color);
          embed.setTitle(client.user.username);
          embed.setDescription(`Mon prefix sur le serveur est : \`${prefix}\`\nNombres de commandes: \`${client.commands.size}\`\n\`${prefix}help <commande> pour plus d'info sur une commande\``);
          embed.setFooter(client.config.footer);
          embed.setTimestamp(new Date());
          for (const category in commandsByCategory) {
            const commands = commandsByCategory[category];
          const commandList = commands.map((command) => `\`${command.name}\``).join(', ');
          embed.addFields({
            name: `${categoryEmojis[category]}〢${category}`,
            value: commandList,
            inline: false,
          });
          }
          message.channel.send({ embeds: [embed] });
      }
      // si le style == paginated retourne le help en pages avec les catégories
      if (style == "buttons") {
        let msg = new message.channel.send({embeds: [{
            color: color,
            title: `Séléctionne un module pour obtenir une page d'aide détaillée`,
           fields: [{
            name : "Support:",
            value: "[\`Clique ici\`](https://discord.gg/devland)"
           }],
           image: {url : imageURL},
            footer: {
                text: client.config.footer.text + " " + `Commandes total: ${client.commands.size}`
        }}], components: [{
            type: 1,
            components: [
            {
                type : 2,
                emoji: "📛",
                custom_id: `antiraid`,
                style: 2
            } , {
                type : 2,
                emoji: "💫",
                custom_id: `backup`,
                style: 2
            } , {
                type : 2,
                emoji: "🤖",
                custom_id: `bot`,
                style: 2
            } , {
                type : 2,
                emoji: "📙",
                custom_id: `buyer`,
                style: 2
            } , {
                type: 2,
                emoji: "💰",
                custom_id: `coins`,
            }
            ]
        }]})
        const collector = message.channel.createMessageComponentCollector({
            componentType: 2,
          });
        collector.on("collect", async (i) => {
            if (i.user.id !== message.author.id) return i.reply({
                content: "Vous ne pouvez pas utiliser ce boutton",
                ephemeral: true
              })
              i.deferUpdate()

        })
        } 

      }

     }