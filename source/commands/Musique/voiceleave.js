module.exports = {
    name: "voiceleave",
    description: "Permet de déconnecter le bot",
    category: "Musique",
    run: async (client, message, args) => {
        if(!message.guild.members.me.voice.channelId) return message.reply({content: "Je ne suis pas en vocal sur le serveur !"})
        message.guild.members.me.voice.setChannel(null)
        return message.reply({content: "Je me deconnecte du vocal a la prochaine !"})
    }
}