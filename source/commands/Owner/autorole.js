module.exports = {
    name: "autorole",
  category: "⚙️〢Owner",
    run: async(client, message) => {
        const isOwn = await client.db.oneOrNone(
            `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
            [message.author.id]
          );
          if (!isOwn) {
            return message.reply({
              content: "Vous n'avez pas la permission d'utiliser cette commande",
            });
          }
          await client.db.oneOrNone(` CREATE TABLE IF NOT EXISTS clarity_${message.guild.id}_autorole (
            role_id VARCHAR(20)
        )`)
        let msg  = await message.channel.send({
            content: "Module en cours de chargement . . . "
        })
        await update(client, message, msg)
    }
}
async function update(client, message, msg){
    let autorole = await client.db.oneOrNone(`SELECT * FROM clarity_${msg.guild.id}_autorole`)
    msg.edit({
        content: null,
        embeds: [{
            title: client.user.username + " " + "Autorole Panel",
            color: parseInt(client.color.replace("#", ""), 16),
            footer: client.config.footer,
            timestamp: new Date(),
            fields: [
                {name: "Rôle", value: autorole && autorole.autorole_role_id ? `<@${autorole.autorole_role_id}>` : "Non configuré", inline: true},
            ],
                    image: {
                          url: client.user.avatarURL({dynamic: true})
                   }
        }],
           components: [{
             type: 1,
             components: [{
                 type: 3,
                 customId: 'autorolem' + msg.id,
                 options: [{
                     label: 'Rôle à ajouter',
                     value: 'autorole'
                 }, {
                    label: "Annuler",
                    value: "cancel",
                    emoji: "❌"
                }]
             }]
            }]  
})
let collector = msg.createMessageComponentCollector({ time: 1000 * 60 });
collector.on('collect', async i => {
    if (i.user.id !== message.author.id) return i.reply({ content: "Vous ne pouvez pas utiliser un menu qui n'est pas le vôtre", ephemeral: true });
    i.deferUpdate()
    if (i.customId === 'autorolem' + msg.id) {
        if (i.values[0] === "autorole") {
            msg.edit({content: null, embeds: null, components: [{
                type: 1,
                components: [{
                    type: 6,
                    customId: "roleSelect"
                }]
            }]})
        }
        if (i.values[0] === "cancel"){
            msg.edit({
                content: null,
                embeds: [{
                    title: client.user.username + " " + "Autorole Panel",
                    color: parseInt(client.color.replace("#", ""), 16),
                    footer: client.config.footer,
                    timestamp: new Date(),
                    fields: [
                        {name: "Rôle", value: autorole && autorole.autorole_role_id ? `<@${autorole.autorole_role_id}>` : "Non configuré", inline: true},
                    ],
                            image: {
                                  url: client.user.avatarURL({dynamic: true})
                           }
                }],
                   components: [{
                     type: 1,
                     components: [{
                         type: 3,
                         customId: 'autorolem' + msg.id,
                         options: [{
                             label: 'Rôle à ajouter',
                             value: 'autorole'
                         }, {
                            label: "Annuler",
                            value: "cancel",
                            emoji: "❌"
                        }]
                     }]
                    }]  
        })
        }
        
    }
})
}