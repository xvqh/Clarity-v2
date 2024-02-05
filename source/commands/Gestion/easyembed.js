export default {
    name: 'easyembed',
    aliases: ['easyemb'],
    run: async (client, message, args) => {
        let color = parseInt(client.color.replace("#", ""), 16)
        let text = args.join(" ")
        message.channel.send({
            embeds: [{
                color: color,
                description: text,
                footer: client.config.footer
            }]
        })
    }
}