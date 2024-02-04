const osu = require('node-osu');
const api = new osu.Api("575e4773ca90422384900f578163ed7d3ec12e97", {
    notFoundAsError: true,
    completeScores: false
})
module.exports={
    name:'osu',
    description:'Get osu stats.',
   category: "💻〢Informations",
    run: async (client, message, args) => {
        let color =  parseInt(client.color.replace("#", ""), 16);
        let username = args[0]
        if (!args[0]) message.channel.send({content: "Veuillez fournir un pseudonyme d\'utilisateur valide !"})
        api.getUser({ u: username }).then(async (user) => {
            const osu = await message.channel.send({
                embeds: [{
                    title: "Osu - Profil De:" + user.name,
                    color: color,
                    footer: client.config.footer,
                    timestamp: new Date(),
                    fields: [{
                        name: "》`Pseudo :`", value: `${user.name}`, inline: true
                    }, {
                        name: "》`Classement :`", value: `${user.pp.rank}`, inline: true
                    }, {
                        name: "》`Score :`", value: `${user.scores.ranked}`, inline: true
                    }, {
                        name: "》`Région :`", value: `${user.country}`, inline: true
                    }, {
                        name: "》`Classement Région :`",
                        value: `${user.pp.countryRank}`,
                        inline: true
                    }, {
                        name: "》`Parties jouées :`", value: `${user.counts.plays}`, inline: true
                    }, {
                        name: "》`Précision :`",
                        value: `${user.accuracyFormatted}`,
                        inline: true
                    }],
                    thumbnail: {url: `http://s.ppy.sh/a/${user.id}}`},
                    image: {url: `http://s.ppy.sh/a/${user.id}}`}
                }]
            })
    })
    }
}