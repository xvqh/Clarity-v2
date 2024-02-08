import { Client, Message, PermissionFlagsBits } from "discord.js";

export default {
    name: "presetconf",
    description: "Configure un preset",
    category: "🎮〢Fun",
    aliases: ["pc"],
    usage: "presetconf <preset>",
    run: async (client: Client, message: Message, args: string[]) => {
        const isOwn = await client.db.oneOrNone(
            `SELECT 1 FROM clarity_${client.user?.id}_${message.guild?.id}_owners WHERE user_id = $1`,
            [message.author.id]
        );
        if (!isOwn) {
            return message.reply({
                content: "Vous n'avez pas la permission d'utiliser cette commande",
            });
        }
        let msgg = await message.channel.send({ content: `Création de la **catégorie** de confessions en cours..` }).then(msg => {
            msg.delete();
            message.guild?.channels.create({
                name: `${message.guild.name}・Confession`,
                type: 4,
                permissionOverwrites: [
                    {
                        id: message.guild.id,
                        deny: PermissionFlagsBits.SendMessages,
                        allow: [PermissionFlagsBits.ViewChannel]
                    },
                ],
            }).then(c => {
                c.setPosition(0);
                c.guild.channels.create({
                    name: '⌛・Se Confesser',
                    type: 0,
                    parent: c.id,
                    permissionOverwrites: [
                        {
                            id: message.guild?.id as string,
                            deny: PermissionFlagsBits.SendMessages,
                            allow: [PermissionFlagsBits.ViewChannel]
                        },
                    ],
                }).then(async (conf) => {
                    await conf.send({
                        embeds: [{
                            color: parseInt(client.color.replace("#", ""), 16),
                            title: "Se confesser",
                            description: "Cliquez sur le bouton ci-dessous pour vous confesser.",
                            footer: client.config.footer
                        }],
                        components: [{
                            type: 1,
                            components: [{
                                type: 2,
                                label: "Se confesser",
                                style: 2,
                                custom_id: "newconfess",
                                disabled: false,
                            }]
                        }]
                    })
                    c.guild.channels.create({
                        name: '🕯️・Confession',
                        type: 0,
                        parent: c.id,
                        permissionOverwrites: [
                            {
                                id: message.guild?.id as string,
                                deny: ["SendMessages"],
                                allow: ["ViewChannel"]
                            },
                        ],
                    }).then(async (newconf) => {
                        client.data.set(`confession_${message.guild?.id}`, newconf.id);
                    })
                })
            })
        })
        // envoie un mess en mp pour prevenir que la configuration est finie et le supprime 30sec apres
        message.author.send({
            content: `La configuration du systeme de confessions est finie.`,
        }).then((confirm) => {
            setTimeout(() => {
                confirm.delete()
            }, 30000)
        })
    }
}