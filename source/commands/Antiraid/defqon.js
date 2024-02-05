export default {
    name: "defqon",
    aliases: ["defqon"],
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
        if(!args[0]){
            return message.reply({
                content: `Merci de préciser un mode : \`defqon <on/off/create>\``,
            });
        }
        const channels = message.guild.channels.cache.filter(ch => ch.type !== 4);
        if(args[0] === 'on'){
            let link = client.data2.get(`defqonlink_${message.guild.id}`);
            client.data2.set(`defqon_${message.guild.id}`, true);
            channels.forEach(channel => {
                channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                    SendMessages: true,
                    Connect: true
                })
            })
           await message.channel.send({
                embeds: [{
                    title: 'Defqon',
                    color: parseInt(client.color.replace("#", ""), 16),
                    description: 'Defqon active !',
                    fields: [{
                        name: `${message.guild.name}`,
                        value: 'subit une attaque nous revenons dès que tout est réglé !'
                    }, {
                        name: 'Lien du serveur de secours',
                        value: `${link}`
                    }],
                    footer: {
                        text: client.config.footer.text
                    }
                }]
            })
        }
        if(args[0] === 'off'){
            client.data2.set(`defqon_${message.guild.id}`, false);
            channels.forEach(channel => {
                channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                    SendMessages: null,
                    Connect: null
                })
            })
            await message.channel.send({
                embeds: [{
                    title: 'Defqon',
                    color: parseInt(client.color.replace("#", ""), 16),
                    description: 'Defqon desactive !',
                    fields: [{
                        name: `${message.guild.name}`,
                        value: 'ne subit plus d\'attaque'
                    }],
                    footer: {
                        text: client.config.footer.text
                    }
                }]
            })
        }
        if(args[0] === 'create'){
            let prevguild = message.guild;
            // previens que le serveur est en cours de creation
          let msg = await  message.channel.send({
                embeds: [{
                    title: 'Defqon',
                    color: parseInt(client.color.replace("#", ""), 16),
                    description: 'Serv Defqon en cours de creation !',
                    fields: [{
                        name: `${message.guild.name}`,
                        value: 'est en cours de creation'
                    }],
                    footer: {
                        text: client.config.footer.text
                    }
                }]
            })
     client.guilds.create({
                name: prevguild.name + ' Defqon',
                reason: 'Defqon',
                icon: prevguild.iconURL({ dynamic: true }),
                // create a new channel
                channels: [
                    {
                        name: 'https://discord.gg/clarityfr',
                        type: 0
                    }
                ]
            }).then(async guild => {
                const invite = await guild.channels.cache.filter(channel => channel.type === 0).first().createInvite();
         msg.edit({
             embeds: [{
                 title: 'Defqon',
                 color: parseInt(client.color.replace("#", ""), 16),
                 description: 'Serv Defqon cree !',
                 fields: [{
                     name: 'Lien d\'invitation',
                     value: invite.url
                 }],
                 footer: {
                     text: client.config.footer.text
                 }
             }]
         })
         // save in the db the new guild
         await client.data2.set(`defqonlink_${message.guild.id}`, invite.url);
          }).catch(err => {console.log(err)
          msg.reply({
              content: err
          })
          });
        }
    }
}