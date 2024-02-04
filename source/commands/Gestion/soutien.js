module.exports = {
    name: "soutien",
   category: "🔨〢Gestion",
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
          await client.db.oneOrNone(` CREATE TABLE IF NOT EXISTS clarity_${message.guild.id}_soutien (
            role_id VARCHAR(20),
            soutien_link TEXT,
            state BOOLEAN,
            role_interdit VARCHAR(20),
            accept_invitlink BOOLEAN,
            only_status BOOLEAN
        )`)
        let msg  = await message.channel.send({
            content: "Module en cours de chargement . . . "
        })
        await update(client, msg)
    }
}
async function update(client, msg) {
    let soutien = await client.db.oneOrNone(`SELECT * FROM clarity_${msg.guild.id}_soutien`)
    // configure automatiquement la db
    
    let color = parseInt(client.color.replace("#", ""), 16);
    msg.edit({content: null , embeds: [
        {
            title: `${msg.guild.name} - Soutien`,
            fields: [
                {
                    name: "Rôle", value: soutien && soutien.role_id ? `<@${soutien.role_id}>` : "Non configuré", inline: true
                },
                {
                    name: "Message", value: soutien && soutien.soutien_link ? soutien.soutien_link : "Non configuré", inline: true
                },
                {
                    name: "État", value: soutien &&  soutien.state ? "✅" : "❌", inline: true
                },
                {
                    name: "Role interdit", value: soutien && soutien.role_interdit ? `<@${soutien.role_interdit}>` : "Non configuré", inline: true
                },
                {
                    name: "Accepter les liens d'invitation du serveur", value: soutien && soutien.accept_invitlink ? "✅" : "❌", inline: true
                },
                {
                    name: "Le status ne doit rien contenir d'autre", value: soutien && soutien.only_status ? "✅" : "❌", inline: true
                }
            ],
            color: color
        }
    ], components: [
        {
            type: 1,
            components: [
                {
                    type: 3, 
                    custom_id: "soutien",
                    options: [
                        {
                            label: "Activer/Désactiver le soutien",
                            value: "status",
                            emoji: "📮"
                        },
                        {
                            label: "Modifier le rôle donner",
                            value: "role",
                            emoji: "📥"
                        },
                        {
                            label: "Autoriser les invitations du serveur",
                            value: "autoriseinvit",
                            emoji: "📧"
                        },
                        {
                            label: "Le status ne doit rien contenir d'autre",
                            value: "riencontenir",
                            emoji: "🎯"
                        },
                        {
                            label: "Changer le message de soutien",
                            value: "addmsg",
                            emoji: "⤵"
                        },
                        {
                            label: "Modfier les rôles interdits",
                            value: "modifroletg",
                            emoji: "🚫",
                        },
                    ]
                }
            ]
        }
    ]})
}