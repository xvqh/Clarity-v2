import { BaseGuildTextChannel, Client, Message } from 'discord.js';

const Perspective = require('perspective-api-client');
const perspective = new Perspective({ apiKey: "AIzaSyCrqBjlfdgKWeb5GGb2qbKisdhBLVb7wLc" });

export default {
    name: 'messageCreate',
    run: async (client: Client, message: Message) => {

        if (message.author.bot) return;
        if (!message.guild) return;
        let db = client.data.get(`antiraid_${message.guild.id}`) || {
            antitoxicity: {
                status: false,
                logs: null,
                logs_enabled: false,
                wl_status: false,
                wl_users: [],
                wl_roles: []
            }
        }
        // Vérifier si l'antitoxicité est activée
        if (!db.antitoxicity.status) return;

        if (db.antitoxicity.status === false) return;

        if (db.antitoxicity.logs_enabled === false) return;

        if (db.antitoxicity.wl_status === true) {
            // Check if the author is whitelisted
            if (!db.antitoxicity.wl_users.includes(message.author.id) /*&& !member.roles.cache.has(db.antitoxicity.wl_roles)*/) {
                // Analysez le message pour détecter la toxicité
                const result = await perspective.analyze([{ text: message.content }]);
                const toxicityScore = result[0].score;

                // Supprimez le message s'il est trop toxique
                if (toxicityScore > 0.7) { // Ajustez le seuil comme nécessaire
                    let channel = message.guild.channels.cache.get(db.antitoxicity.logs);
                    if (!channel) return;
                    message.delete();
                    message.reply({
                        embeds: [{
                            color: parseInt(client.color.replace("#", ""), 16),
                            description: `**${message.author}** a envoyé un message non approprié.\n**Toxicite du message** : ${toxicityScore}%`,
                            timestamp: new Date().getTime() as unknown as string,
                            footer: client.config.footer,
                            thumbnail: {
                                url: message.author.displayAvatarURL({ forceStatic: false })
                            },
                            author: {
                                name: message.author.tag,
                                icon_url: message.author.displayAvatarURL({ forceStatic: false })
                            }
                        }]
                    });
                    if (channel && db.antitoxicity.logs_enabled) (channel as BaseGuildTextChannel).send({

                        embeds: [{
                            color: parseInt(client.color.replace("#", ""), 16),
                            description: `**${message.author}** a envoyé un message non approprié.\n**Toxicite du message** : ${toxicityScore}%`,
                            timestamp: new Date().getTime() as unknown as string,
                            footer: client.config.footer,
                            fields: [{
                                name: 'Message',
                                value: message.content
                            }],
                            thumbnail: {
                                url: message.author.displayAvatarURL({ forceStatic: false })
                            },
                            author: {
                                name: message.author.tag,
                                icon_url: message.author.displayAvatarURL({ forceStatic: false })
                            }
                        }]
                    })
                }
            }
        } else {

            const result = await perspective.analyze([{ text: message.content }]);
            const toxicityScore = result[0].score;

            if (toxicityScore > 0.5) {
                let channel = message.guild.channels.cache.get(db.antitoxicity.logs);
                if (!channel) return;
                message.delete();
                message.reply({
                    embeds: [{
                        color: parseInt(client.color.replace("#", ""), 16),
                        description: `**${message.author}** a envoyé un message non approprié.\n**Toxicite du message** : ${toxicityScore}%`,
                        timestamp: new Date().getTime() as unknown as string,
                        footer: client.config.footer,
                        thumbnail: {
                            url: message.author.displayAvatarURL({ forceStatic: false })
                        },
                        author: {
                            name: message.author.tag,
                            icon_url: message.author.displayAvatarURL({ forceStatic: false })
                        }
                    }]
                });
                if (channel && db.antitoxicity.logs_enabled) (channel as BaseGuildTextChannel).send({

                    embeds: [{
                        color: parseInt(client.color.replace("#", ""), 16),
                        description: `**${message.author}** a envoyé un message non approprié.\n**Toxicite du message** : ${toxicityScore}%`,
                        timestamp: new Date().getTime() as unknown as string,
                        footer: client.config.footer,
                        fields: [{
                            name: 'Message',
                            value: message.content
                        }],
                        thumbnail: {
                            url: message.author.displayAvatarURL({ forceStatic: false })
                        },
                        author: {
                            name: message.author.tag,
                            icon_url: message.author.displayAvatarURL({ forceStatic: false })
                        }
                    }]
                })
            }
        }

    }
}