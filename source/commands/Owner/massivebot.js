module.exports = {
    name: "massivebotrole",
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
          let color = parseInt(client.color.replace('#', ''), 16);
        if (args[0] === "add") {
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            if (!role) return message.reply({ content: "Veuillez mentionner un role." });
            let bots = Array.from(message.guild.members.cache.filter((m) => m.user.bot).values());
            let i = 0;
            let startTime = Date.now();
            let interval = setInterval(() => {
                if (i >= bots.length) {
                    clearInterval(interval);
                    let endTime = Date.now();
                    let executionTime = (endTime - startTime) / 1000;
                    message.channel.send({
                        embeds: [{
                            color: color,
                            description: `Le rôle ${role.name} a été ajouté avec succès à ${bots.length} bots en ${executionTime} secondes`
                        }]
                    });
                } else {
                    // Vérifier si le bot peut gérer le rôle
                    if (bots[i].roles.highest.comparePositionTo(role) <= 0) {
                       console.log(`Je ne peux pas ajouter le rôle ${role.name} au bot ${bots[i].user.tag} car il est supérieur ou égal à mon rôle le plus élevé.`)
                    } else {
                        bots[i].roles.add(role);
                    }
                    i++;
                }
            }, 2000);
        }
        if (args[0] === "remove") {
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            if (!role) return message.reply({ content: "Veuillez mentionner un role." });
            let bots = Array.from(message.guild.members.cache.filter((m) => m.user.bot).values());
            let i = 0;
            let startTime = Date.now();
            let interval = setInterval(() => {
                if (i >= bots.length) {
                    clearInterval(interval);
                    let endTime = Date.now();
                    let executionTime = (endTime - startTime) / 1000;
                    message.channel.send({
                        embeds: [{
                            color: color,
                            description: `Le rôle ${role.name} a été retiré avec succès à ${bots.length} bots en ${executionTime} secondes`
                        }]
                    });
                } else {
                    // Vérifier si le bot peut gérer le rôle
                    if (bots[i].roles.highest.comparePositionTo(role) <= 0) {
                        console.log(`Je ne peux pas retirer le rôle ${role.name} au bot ${bots[i].user.tag} car il est supérieur ou égal à mon rôle le plus élevé.`)
                    } else {
                        bots[i].roles.add(role);
                    }
                    i++;
                }
            }, 2000);
        }
    }
}