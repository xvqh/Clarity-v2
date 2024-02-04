module.exports = {
    name: 'servinv',
    category: 'Gestion',
    description: 'Affiche la liste des serveurs',
    usage: '',
    aliases: ['servinvite', 'serverinv', 'serverinvite'],
    run: async(client, message, args) =>
    {
        const guildId = args[0];
        try {
            const guild = await client.guilds.fetch(guildId);
            if (!guild) return message.channel.send(`Aucun serveur trouvé pour \`${args[0] || 'rien'}\``);

            const invite = await guild.channels.cache.filter(channel => channel.type === 0).first().createInvite();
            message.channel.send(`Voici le lien d'invitation pour le serveur ${guild.name}: ${invite.url}`);
        } catch (error) {
            message.channel.send('Une erreur s\'est produite.');
            console.error(error);
        }
    }
}