import { Client, Message } from "discord.js";
import figlet from "figlet";
export default {
    name: 'ascii',
    aliases: [],
    description:"Écrivez vos textes en ASCII",
    run: async (client: Client, message: Message, args: string[]) => {

    
        if(!args[0]) return message.channel.send({content: ' **Veuillez fournir du texte**'});

      let msg = args.join(" ");
        
        figlet.text(msg, function (err: any, data: any){
            if(err){
                console.log(`Quelque chose s'est mal passé`);
                console.dir(err);
            }
            if(data.length > 2000) return message.channel.send({content: '**Veuillez fournir un texte de moins de 2 000 caractères**'})

            message.channel.send({content: '```' + data + '```'})
        })

    }
}
