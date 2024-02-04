const figlet = require("figlet")

module.exports = {
    name: 'ascii',
    aliases: [],
    description:"Écrivez vos textes en ASCII",
    run: async (client, message, args, prefix) => {

    
        if(!args[0]) return message.channel.send({content: ' **Veuillez fournir du texte**'});

        msg = args.join(" ");
        
        figlet.text(msg, function (err, data){
            if(err){
                console.log(`Quelque chose s'est mal passé`);
                console.dir(err);
            }
            if(data.length > 2000) return message.channel.send({content: '**Veuillez fournir un texte de moins de 2 000 caractères**'})

            message.channel.send({content: '```' + data + '```'})
        })

    }
}  