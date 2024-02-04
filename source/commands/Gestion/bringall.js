const fs = require('fs');
const Discord = require('discord.js')

module.exports = {
    name: "bringall",
    run: async(client, message, args) => {

        if (client.config.devs?.includes(message.author.id)) {
            let channela = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.member.voice.channel;
        if (!channela) return message.channel.send({content: "Veuillez mentionner un salon vocal ou un id de salon vocal"})
        if (channela.type !== 2) return;
        let movedUsers = [];
        const channels = message.guild.channels.cache.filter(ch => ch.type === 2 && ch.id !== channela.id && ch.members.size > 0)
        for await(const [_, channel] of channels)
         for await(const [_, member] of channel.members) {
             await member.voice.setChannel(channela, `Bringall by ${message.author.tag}`).then(() => {
                movedUsers.push(`${member.user.username}: ${channel.name}`);
             }).catch(() => {
             })
         }
         fs.writeFileSync('movedUsers.txt', movedUsers.join('\n'));


         let list = fs.readFileSync('movedUsers.txt');

         const out = new Discord.AttachmentBuilder(Buffer.from(list), {name: `${message.guild.name}-bringall.txt`});
 
        // success message
        message.channel.send({content: `Tous les membres sont maintenant dans le salon ${channela}`, files: [out]})
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
        let channela = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.member.voice.channel;
        if (!channela) return message.channel.send({content: "Veuillez mentionner un salon vocal ou un id de salon vocal"})
        if (channela.type !== 2) return;
        let movedUsers = [];
        const channels = message.guild.channels.cache.filter(ch => ch.type === 2 && ch.id !== channela.id && ch.members.size > 0)
        for await(const [_, channel] of channels)
         for await(const [_, member] of channel.members) {
             await member.voice.setChannel(channela, `Bringall by ${message.author.tag}`).then(() => {
                movedUsers.push(`${member.user.username}: ${channel.name}`);
             }).catch(() => {
             })
         }
         fs.writeFileSync('movedUsers.txt', movedUsers.join('\n'));

         let list = fs.readFileSync('movedUsers.txt');

         const out = new Discord.AttachmentBuilder(Buffer.from(list), {name: `${message.guild.name}-bringall.txt`});
 
        // success message
        message.channel.send({content: `Tous les membres sont maintenant dans le salon ${channela}`, files: [out]})
    }
}
 }
 