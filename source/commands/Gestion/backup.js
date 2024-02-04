const backup = require("discord-backup");
backup.setStorageFolder(__dirname+"/backups/");
const {EmbedBuilder} = require("discord.js")
module.exports = {
    name: 'backup',
    run: async (client, message, args) => {
        const isBuy = await client.functions.isBuy(client, message.author.id);
        if (!isBuy) {
            return message.reply({
                content: "Vous n'avez pas la permission d'utiliser cette commande",
            });
        }
        if (!args[0]) return message.reply({content: "Veuillez bien utiliser la commande : \`<backup create>\`/ \`<backup load>\` / \`<backup list>\` / \`<backup del>\`"})
        if (args[0] === "create") {

            backup.create(message.guild, {
                maxMessagesPerChannel: 100,
                jsonSave: true,
                jsonBeautify: true,
                doNotBackup: [],
                backupMembers: true,
                metadata: {
                    name: message.guild.name
                }
            }).then((backupData) => {
                message.channel.send({content: `Backup correctement créer, faites \` la commande backup load ${backupData.id}\` pour charger la backup`})
            })
        }
        else if (args[0] === "load"){
            let backupID = args[1];
            if(!backupID){
                return message.channel.send({content: ` Vous devez spécifier une ID de backup valide !`});
            }
            backup.fetch(backupID).then(async () => {
                message.channel.send({content: ` Quand la backup est chargé, tout les channels, rôles, etc. Vont être remplacé !`})
                message.author.send({content: `Chargement de la backup en cours . . . `})
                backup.load(backupID, message.guild).then(() => {}).catch((err) => {
                    console.log(err)
                    return message.author.send({content:`Désolé, une erreur est survenue, veuillez vérifier si je possède les permissions d'administrateur`});
                })
            }).catch((err) => {
                console.log(err)
                return message.channel.send({content: `Aucun résultat pour la backup \`"+backupID+"\``});
            })
        }
        else if (args[0] === "list"){
            backup.list().then(async (backups) => {
                let backupNames = await Promise.all(backups.map(async (backupID) => {
                    let backupInfo = await backup.fetch(backupID);
                    let serverName = backupInfo.data.metadata?.name;
                    return `${backupID}: ${serverName}`;
                }));
                message.channel.send({embeds: [{
                        title: '📰 Liste des backups',
                        description: `\`\`\`${backupNames.join("\n")}\`\`\` `,
                        color: parseInt(client.color.replace("#", ""), 16),
                        footer: client.config.footer,
                        timestamp: new Date()
                    }]})
            })
        }



        else if (args[0] === "del"){
            if (!args[1]) return message.reply({content: "Veuillez préciser l id de la backup que vous souhaitez supprimer"})
            backup.remove(args[1]);
            message.channel.send({content:` La backup ${args[1]} a été supprimé avec succès`});
        }
    }
}