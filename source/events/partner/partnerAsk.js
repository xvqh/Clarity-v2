const { PermissionsBitField } = require('discord.js');
module.exports = {
    name: "interactionCreate",
    run: async(client, interaction) => {
        if(!interaction.guild) return;
        await client.db.none(`
        CREATE TABLE IF NOT EXISTS clarity_${client.user.id}_${interaction.guild.id}_partnerask (
            ask_id VARCHAR(20),
            askown_id VARCHAR(20)
        )`);
        if(interaction.customId === "partnerask") {
            interaction.deferUpdate()
            try {
               const thread = await interaction.channel.threads.create({
                name: `🤝・${interaction.user.username}`,
                type: 12,
                invitable: false,
                autoArchiveDuration: 60,
                reason: `${interaction.user.username} souhaite faire un partenariat`
            }).then(async (partner) => {
                partner.members.add(interaction.user)
              
                const admin = interaction.guild.members.cache.filter(member => member.permissions.has('Administrator'))
                admin.forEach(m => {
                    partner.members.add(m)
                })
                await client.db.query(`INSERT INTO clarity_${client.user.id}_${interaction.guild.id}_partnerask (ask_id, askown_id) VALUES (\$1, \$2)`, [partner.id, interaction.user.id]);
                await partner.send({embeds: [{
                    title: "🤝・Partenariat",
                    description: `Pour demander un partenariat avec ${interaction.guild.name} veuillez ouvrir un ticket`,
                    footer: client.config.footer
                }], components: [{type:1 ,components: [{
                    type: 2,
                    style: 2,
                    label: "Fermer la demande",
                    custom_id: "closeask",
                    emoji: {
                        name: "❌"
                    }
                }, {
                    type: 2,
                    style: 2,
                    label: "Prendre en charge",
                    custom_id: "claimask",
                    emoji: {
                        name: "✋"
                    }
                }]}]})
            })
          
        } catch(e){
            console.error(e)
        }
        } else if(interaction.customId ==="closeask"){
            interaction.deferUpdate()
            try {
                const threadId = interaction.channel.id;
                const thread = await interaction.guild.channels.fetch(threadId);
                if (thread && thread.isThread()) {
                    await thread.delete();
                    await client.db.none(`DELETE FROM clarity_${client.user.id}_${interaction.guild.id}_partnerask WHERE ask_id = \$1`, [thread.id])
                }
            } catch(e){
                console.error(e)
            }
        }
        else if(interaction.customId ==="claimask"){
            interaction.deferUpdate()
            try {
                const threadId = interaction.channelId;
                const thread = await interaction.guild.channels.fetch(threadId);
                if (thread && thread.isThread()) {
                    const result = await client.db.one(`SELECT askown_id FROM clarity_${client.user.id}_${interaction.guild.id}_partnerask WHERE ask_id = \$1`, [threadId]);
                    if (result) {
                       await thread.members.cache.forEach((m) => {
                        if(m.id !== result.askown_id && m.id !== interaction.user.id && !m.user.bot) {
                            thread.members.remove(m.id);
                        }
                       })
                        await thread.send({ content: `La demande vient d'être prise en charge par ${interaction.user.username}` });
                    }
        }
            } catch(e){
                console.error(e)
            }
        }
    }
}