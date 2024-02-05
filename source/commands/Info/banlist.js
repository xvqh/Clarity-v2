import Discord from "discord.js";

export default {
    name: "banlist",
    category: "💻〢Informations",
    description: "Affiche la liste des utilisateurs bannis",
    aliases: ["banl"],
    run: async (client, message) => {
        if (!message.member.permissions.has("Ban_Members")) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.");

        let guild = message.guild;
        const color = parseInt(client.color.replace("#", ""), 16);
        let bans = await guild.bans.fetch();
        const list = (await bans).map((member) => "`" + member.user.tag + "`").join("\n")
        if (bans.size === 0) return message.channel.send("Aucun utilisateur bannis.");
        // affiche la banlist dans un embed
        const embed = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(`\`${message.guild.name}\` Ban List`)
            .setDescription(`Il y a **${bans.size}** membres bannis.\n${list} `)
        message.channel.send({ embeds: [embed] });
    }
}