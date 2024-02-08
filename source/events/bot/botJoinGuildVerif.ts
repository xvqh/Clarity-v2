import { ButtonInteraction, CacheType, ChatInputCommandInteraction, Client, Interaction } from "discord.js";

export default {
    name: "interactionCreate",
    run: async (client: Client, interaction: ButtonInteraction<CacheType>) => {
        if (interaction.guild) return;
        let custom_id = interaction.customId.split("_")[0]
        if (custom_id === "leave") {
            let id = interaction.customId.split("_")[1]
            let guild = client.guilds.cache.get(id)
            if (!guild) {
                interaction.reply({ content: "Je ne suis plus dans le serveur", ephemeral: true })
                setTimeout(() => {
                    return interaction.deleteReply();
                }, 6000)
                return;
            }
            let components = {
                type: 1,
                components: [
                    {
                        type: 2,
                        label: "Oui",
                        custom_id: "yes",
                        style: 2
                    },
                    {
                        type: 2,
                        label: "Non",
                        custom_id: "no",
                        style: 4
                    }
                ]
            }
            let r = await interaction.reply({ content: "Voulez-vous vraiment quitter ce serveur", components: [components], ephemeral: true })

            let collector = interaction.channel?.createMessageComponentCollector();

            collector?.on("collect", async (i) => {
                switch (i.customId) {
                    case "yes":
                        if (guild) {
                            i.deleteReply();
                            let e = await i.reply({ content: `J'ai bien quitté ${guild.name}`, ephemeral: true })
                            guild.leave()
                            setTimeout(() => {
                                e.delete()
                            }, 6000)
                        } else r.delete()
                        break;
                    case "no":
                        r.delete()
                        break;
                }
            })
        }
    }
}