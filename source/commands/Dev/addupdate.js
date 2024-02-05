import simpleGit from 'simple-git';

export default {
    name: "addupdate",
  category: "🔗〢Dev",
    run : async(client, message, args) => {
        if (!client.config.devs.includes(message.author.id)) {
            return message.reply({content: "Seul les devs peuvent ajouter une mise a jour pour vos bots via le bot principal."})
        }
        let version = 0
        simpleGit().add('./source')
        .add('./package.json')
        .add('./package-lock.json')
        .commit("update" + [version + 1])
        .push('origin', 'main', (err, result) => {
            if (err) {
                console.error(err);
              } else {
                console.log("Mise a jours ajouté avec succès")
                message.channel.send({content: "La nouvelle mise a jour vient d être push avec succès"})
              }
        })
    }
}