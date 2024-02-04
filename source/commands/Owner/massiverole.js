module.exports = {
    name: "massiverole",
  category: "⚙️〢Owner",
    run: async (client, message, args) => {
        const isOwn = await client.db.oneOrNone(
            `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
            [message.author.id]
          );
          if (!isOwn) {
            return message.reply({
              content: "Vous n'avez pas la permission d'utiliser cette commande",
            });
          }
          let color = parseInt(client.color.replace("#", ""), 16);
        if (args[0] === "add") {
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
           let members = Array.from(message.guild.members.cache.filter((m) => !m.user.bot).values());
           let i = 0;
            let interval = setInterval(() => {
                if (i >= members.length) {
                    clearInterval(interval);
                    message.channel.send({
                        embeds: [{
                            color: color,
                            description: `Le rôle ${role.name} a été ajouté avec succès à ${members.length} membres`
                        }]
                    });
                } else {
                    // Vérifier si le bot peut gérer le rôle
                    if (members[i].roles.highest.comparePositionTo(role) <= 0) {
                        console.log(`Je ne peux pas ajouter le rôle ${role.name} a ${members[i].user.username} car il est supérieur ou égal à mon rôle le plus élevé.`)
                    } else {
                        members[i].roles.add(role);
                    }
                    i++;
                }
            }, 1000);
        }
        if (args[0] === "remove") {
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            if (!role) return message.reply({ content: "Veuillez mentionner un role." });
           let members = Array.from(message.guild.members.cache.filter((m) => !m.user.bot).values());
           let i = 0;
            let interval = setInterval(() => {
                if (i >= members.length) {
                    clearInterval(interval);
            message.channel.send({
                embeds: [{
                    color: color,
                    description: `Le rôle ${role.name} a été retiré avec succès à ${members.length} membres`
                }]
            });
        } else {
            if (members[i].roles.highest.comparePositionTo(role) <= 0) {
                console.log(`Je ne peux pas retirer le rôle ${role.name} a ${members[i].user.username} car il est supérieur ou égal à mon rôle le plus élevé.`)
            } else {
                members[i].roles.remove(role);
            }
            i++;
        }
            }, 1000);
        }
    }
}