import { useQueue } from 'discord-player';

export default {
    name: '8d',
    run: async (client, message, args) => {
        const queue = useQueue(message.guild.id);
        await queue.filters.ffmpeg.toggle(['8D']);
        message.channel.send({
            embeds: [{
                color: parseInt(client.color.replace("#", ""), 16),
                author: { name: message.author.tag, icon_url: message.author.displayAvatarURL({ dynamic: true }) },
                footer: client.config.footer,
                title: client.user.username + ' Filtre audio',
                description: "8d active !"
            }]
        });
    }
}