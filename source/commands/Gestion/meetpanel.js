module.exports = {
    name: 'meetpanel',
    run: async(client, message, args) => {
        if (client.config.devs.includes(message.author.id)) {
            let msg = await message.channel.send({
                embeds: [{
                    author: {
                        name: message.guild.name,
                        iconURL: message.guild.iconURL({ dynamic: true })
                    },
                    color: parseInt(client.color.replace("#", ""), 16),
                    description: `**Cliquez sur le bouton ci-dessous pour utiliser le systeme de meeting**` + `\n` + `\`・ Profil :\`\n` + `> Vous pouvez créer ou modifier votre profil. Une fois votre profil créer vous pourrez l'envoyer dans le channel correspondant pour recevoir des demandes. Vous ne pouvez pas envoyer de demande à quelqu'un si vous n'avez pas de profil créé.\n` +   `\n` + 
                    `\`・ Envoyer :\`\n` +
                    `> Vous pouvez envoyer votre profil dans le channel correspondant, l'envoie de profil est limité à 1 par jour.\n` +
                    `\n` +
                    `\`・ Information :\`` +
                    `> Vous donne les informations par rapport à toutes vos demandes, match et likes reçu.` ,
                    footer: client.config.footer
                }],
                components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        custom_id: 'profil',
                        label: 'Profil',
                        style: 1
                    }, {
                        type: 2,
                        custom_id: 'info',
                        label: 'Informations',
                        style: 1
                    }, {
                        type: 2,
                        custom_id: 'envoyer',
                        label: 'Envoyer',
                        style: 4
                    }]
                }]
            })
        } else {
            const isOwn = await client.db.oneOrNone(
                `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
                [message.author.id]
            );
            if (!isOwn) {
                return message.reply({
                   content: "Vous n'avez pas la permission d'utiliser cette commande",
                });
            }
        }
    }
}