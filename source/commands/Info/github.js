const fetch = require('node-fetch')
const moment = require('moment')
module.exports = {
    name: "github",
    run: async(client, message, args) => {
        fetch(`https://api.github.com/users/${args.join('-')}`)
        .then(res => res.json()).then(body => {
            if (body.message) return message.channel.send({content: `Utilisateur inconnu | Merci de me donner un nom d'utilisateur valide !`});
            let {
                login,
                avatar_url,
                name,
                id,
                html_url,
                public_repos,
                followers,
                following,
                location,
                created_at,
                bio
              } = body;
            return message.reply({embeds: [{
                color: parseInt(client.color.replace("#", ""), 16),
                title: `${login} Informations !`,
                fields: [
                    {
                        name: "Pseudo",
                        value: login,
                        inline: true
                    },
                    {
                        name: "Nom",
                        value: name,
                        inline: true
                    }, {
                        name: "ID",
                        value: id,
                        inline: true
                    }, {
                        name: "Bio",
                        value: bio,
                        inline: true
                    }, {
                        name: `Répertoires publique`,
                        value: `${public_repos || "Aucun"}`,
                        inline: true
                    }, {
                        name: `Abonnés`,
                        value: `${followers || "Aucun"}`,
                        inline: true
                    } , {
                        name: `Abonnés à`,
                        value: `${following || "Personne"}`,
                        inline: true
                    } , {
                        name: `Localisation`,
                        value: `${location || "Aucune localisation"}`,
                        inline: true
                    } , {
                        name: `Date de creation`,
                        value: `${moment(created_at).format('dddd, MMMM, YYYY')}`,
                        inline: true
                    }
                ],
                timestamp: new Date(),
                footer: client.config.footer,
                image: {
                    url: avatar_url
                },
                author: {
                    name: login, icon_url: avatar_url
                },
                url: html_url,
            }]})
        })
    }
}