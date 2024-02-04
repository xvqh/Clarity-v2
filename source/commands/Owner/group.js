module.exports = {
    name: "group",
    category: "Owner",
    run: async (client, message, args) => {
        const isBuy = await client.functions.isBuy(client, message.author.id);
    if (!isBuy) {
      return message.reply({
        content: "Vous n'avez pas la permission d'utiliser cette commande",
      });
    }
          
          let msg = await message.channel.send({content: 'Chargement du module . . .'})
          await update(client, message, msg)
    }
}
async function update(client, message, msg){
 await client.db.none(`
    CREATE TABLE IF NOT EXISTS clarity_${client.user.id}_group (
      user_id VARCHAR(20) PRIMARY KEY
    )
  `);
  let groupm = await client.db.any(`
  SELECT * FROM clarity_${client.user.id}_group
`);
    let color = parseInt(client.color.replace('#', ''), 16);
    msg.edit({
        content: null,
        embeds: [{
            title: 'Group',
            description: 'Liste des membres du groupe',
            color: color,
            footer: client.config.footer,
            timestamp: new Date(),
            fields: groupm.map((user) => ({
                name: `${client.users.cache.get(user.user_id).username}`,
                value: 'Group Member'
              })),
        }],
        components: [{
            type: 1,
            components: [{
                type: 2,
                emoji: '➕',
                style: 2,
                custom_id: 'addmember' + message.id
            }, {
                type: 2,
                emoji: '➖',
                style: 2,
                custom_id: 'removemember' + message.id
            }, {
                type: 2,
                emoji: '🔃',
                style: 2,
                custom_id: 'refresh' + message.id
            },{
                type: 2,
                emoji: '❌',
                style: 2,
                custom_id: 'close' + message.id
            }]
        }]
    })
    // collector
    const collector = msg.createMessageComponentCollector({
        filter: (i) => i.user.id === message.author.id,
        time: 60000*10*3
    })
    collector.on('collect', async(i) => {
        i.deferUpdate()
        if(i.customId === 'addmember' + message.id){
            msg.edit({
                content: null,
                embeds: null,
                components: [{
                    type: 1,
                    components: [{
                        type: 5,
                        custom_id: 'selectmember' + message.id,
                    }]
                }]
            })
        }
        if(i.customId === 'removemember' + message.id){
            msg.edit({
                content: null,
                embeds: null,
                components: [{
                    type: 1,
                    components: [{
                        type: 5,
                        custom_id: 'selectremove' + message.id,
                    }]
                }]
            })
        }
        if(i.customId === 'close' + message.id){
            msg.delete()
        }
        if(i.customId === 'refresh' + message.id){
            let group = await client.db.any(`
            SELECT * FROM clarity_${client.user.id}_group
          `);
          if (!group.length) {
            return message.channel.send("Aucun membre dans le groupe.");
          }

 await client.db.none(
          `DELETE FROM clarity_${client.user.id}_group`
        )
            let groupm = await client.db.any(`
            SELECT * FROM clarity_${client.user.id}_group
          `);
            msg.edit({
                content: null,
                embeds: [{
                    title: 'Group',
                    description: 'Liste des membres du groupe',
                    color: color,
                    footer: client.config.footer,
                    timestamp: new Date(),
                    fields: groupm.map((user) => ({
                        name: `${client.users.cache.get(user.user_id).username}`,
                        value: 'Group Member'
                      })),
                }],
                components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        emoji: '➕',
                        style: 2,
                        custom_id: 'addmember' + message.id
                    }, {
                        type: 2,
                        emoji: '➖',
                        style: 2,
                        custom_id: 'removemember' + message.id
                    }, {
                        type: 2,
                        emoji: '🔃',
                        style: 2,
                        custom_id: 'refresh' + message.id
                    },{
                        type: 2,
                        emoji: '❌',
                        style: 2,
                        custom_id: 'close' + message.id
                    }]
                }]
            })
        }
    })
    collector.on('end', async() => {
        msg.delete().catch({})
    })
    client.on('interactionCreate', async(i) => {
        if(i.customId === 'selectmember' + message.id){
        
            let color = parseInt(client.color.replace('#', ''), 16);
            // ajoute l utilisateur a la db qu on appel avec group (pg-promise)
            await client.db.none(
                `INSERT INTO clarity_${client.user.id}_group (user_id) VALUES (\$1)`,
                [i.values[0]]
              );
              let groupm = await client.db.any(`
              SELECT * FROM clarity_${client.user.id}_group
            `);
            msg.edit({
                content: null,
                embeds: [{
                    title: 'Group',
                    description: 'Liste des membres du groupe',
                    color: color,
                    footer: client.config.footer,
                    timestamp: new Date(),
                    fields: groupm.map((user) => ({
                        name: `${client.users.cache.get(user.user_id).username}`,
                        value: 'Group Member'
                      })),
                }],
                components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        emoji: '➕',
                        style: 2,
                        custom_id: 'addmember' + message.id
                    }, {
                        type: 2,
                        emoji: '➖',
                        style: 2,
                        custom_id: 'removemember' + message.id
                    }, {
                        type: 2,
                        emoji: '🔃',
                        style: 2,
                        custom_id: 'refresh' + message.id
                    },{
                        type: 2,
                        emoji: '❌',
                        style: 2,
                        custom_id: 'close' + message.id
                    }]
                }]
            })
        }
        if(i.customId === 'selectremove' + message.id){
            let color = parseInt(client.color.replace('#', ''), 16);
            // supprime l utilisateur a la db qu on appel avec group (pg-promise)
            await client.db.none(
                `DELETE FROM clarity_${client.user.id}_group WHERE user_id = \$1`,
                [i.values[0]]
            )
            let groupm = await client.db.any(`
            SELECT * FROM clarity_${client.user.id}_group
          `);
            msg.edit({
                content: null,
                embeds: [{
                    title: 'Group',
                    description: 'Liste des membres du groupe',
                    color: color,
                    footer: client.config.footer,
                    timestamp: new Date(),
                    fields: groupm.map((user) => ({
                        name: `${client.users.cache.get(user.user_id).username}`,
                        value: 'Group Member'
                      })),
                }],
                components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        emoji: '➕',
                        style: 2,
                        custom_id: 'addmember' + message.id
                    }, {
                        type: 2,
                        emoji: '➖',
                        style: 2,
                        custom_id: 'removemember' + message.id
                    }, {
                        type: 2,
                        emoji: '🔃',
                        style: 2,
                        custom_id: 'refresh' + message.id
                    },{
                        type: 2,
                        emoji: '❌',
                        style: 2,
                        custom_id: 'close' + message.id
                    }]
                }]
    })
}
    })
}