import Discord, { Client, VoiceState } from 'discord.js';

export default {
    name: 'voiceStateUpdate',
    run: async (client: Client, oldState: VoiceState, newState: VoiceState) => {
        const { member, guild } = oldState;

        if (member?.user.bot) return;

        const data = await client.data2.get(`tempvocsettings_${guild.id}`) || {
            status: false,
            category: null,
            channel: null,
        }
        if (!data) return;

        const categoid = data.category;
        const channelid = data.channel;
        const category = client.channels.cache.get(categoid) as Discord.CategoryChannel;
        const channel = client.channels.cache.get(channelid);

        if (data.status === true) {
            if (oldState.channel === null || oldState.channel) {
                if (newState.channelId === channel?.id) {
                    let tempsetting = await client.data2.get(`tempsetting_${member?.id}`) || {
                        name: null,
                        limit: 0,
                        lock: false,
                        hide: false,
                        owner: null,
                        blockuser: [],
                        blockrole: [],
                        allowuser: [],
                        allowrole: []
                    };

                    if (!category) return;

                    oldState.guild.channels.create({
                        name: tempsetting.name || `⏱️・${member?.user.username}`,
                        type: Discord.ChannelType.GuildVoice,
                        parent: category,
                        reason: 'Clarity | TempVoc',
                        permissionOverwrites: [
                            {
                                id: member?.id as string,
                                allow: ["Connect", "ManageChannels"],
                            },
                            {
                                id: guild.id,
                                allow: ["Connect"],
                            },
                        ]
                    }).then(async clari => {
                        newState.member?.voice.setChannel(clari);
                        let tempsetting = await client.data2.get(`tempsetting_${member?.id}`) || {
                            name: null,
                            limit: 0,
                            lock: false,
                            hide: false,
                            owner: null,
                            blockuser: [],
                            blockrole: [],
                            allowuser: [],
                            allowrole: []
                        }
                        // set the data
                        await client.data2.set(`tempvoc_${newState.guild.id}_${newState.member?.id}`, clari.id)
                        // set owner data of tempsettings to member
                        tempsetting.owner = member?.id
                        await client.data2.set(`tempsetting_${member?.id}`, tempsetting)
                        // send a message
                        let mess = await clari.send({
                            embeds: [{
                                title: `Clarity | TempVoc`,
                                author: {
                                    name: member?.user.username as string,
                                    icon_url: member?.user.displayAvatarURL({ forceStatic: false }),
                                },
                                description: `**${member?.user.username}** Bienvenue dans votre vocal temporaire.\nTu peux configurer ton channel a ta guise avec ce panel`,
                                thumbnail: {
                                    url: client.user?.displayAvatarURL({ forceStatic: false }) as string,
                                },
                                fields: [
                                    {
                                        name: "Channel",
                                        value: `\`\`\`${guild.channels.cache.get(clari.id) ? guild.channels.cache.get(clari.id)?.name : 'Non Trouver'}\`\`\``,
                                        inline: true
                                    }, {
                                        name: "Limit",
                                        value: `\`\`\`${tempsetting.limit ? tempsetting.limit : 'Aucune Limite de configurer'}\`\`\``,
                                        inline: true
                                    }, {
                                        name: "Lock",
                                        value: `\`\`\`${tempsetting?.lock === true ? "✅ Activer" : "❌ Désactiver"}\`\`\``,
                                        inline: true
                                    }, {
                                        name: "Hide",
                                        value: `\`\`\`${tempsetting?.hide === true ? "✅ Activer" : "❌ Désactiver"}\`\`\``,
                                        inline: true
                                    }, {
                                        name: "Owner",
                                        value: `\`\`\`${client.users.cache.get(tempsetting?.owner) ? client.users.cache.get(tempsetting?.owner)?.username : 'Proprietaire du channel non trouver'}\`\`\``,
                                        inline: true
                                    }, {
                                        name: "Block User",
                                        value: `\`\`\`${tempsetting?.blockuser.join(", ") || 'Aucun utilisateur interdit'}\`\`\``,
                                        inline: true
                                    }, {
                                        name: "Block Role",
                                        value: `\`\`\`${tempsetting?.blockrole.join(", ") || 'Aucun role interdit'}\`\`\``,
                                        inline: true
                                    }, {
                                        name: "Allow User",
                                        value: `\`\`\`${tempsetting?.allowuser.join(", ") || 'Aucun utilisateur autorisé'}\`\`\``,
                                        inline: true
                                    }, {
                                        name: "Allow Role",
                                        value: `\`\`\`${tempsetting?.allowrole.join(", ") || 'Aucun role autorisé'}\`\`\``,
                                        inline: true
                                    }
                                ],
                                timestamp: new Date().getTime().toString(),
                                footer: client.config.footer
                            }],
                            components: [{
                                type: 1,
                                components: [{
                                    type: 3,
                                    custom_id: 'tempvocsettings',
                                    options: [{
                                        label: 'Name',
                                        value: 'name',
                                        description: 'Configurer le nom du vocal temporaire',
                                    }, {
                                        label: 'Limit',
                                        value: 'limit',
                                        description: 'Configurer la limite du vocal temporaire',

                                    }, {
                                        label: 'Lock',
                                        value: 'lock',
                                        description: 'Lock le vocal temporaire',

                                    }, {
                                        label: 'Hide',
                                        value: 'hide',
                                        description: 'Cacher le vocal temporaire',

                                    }, {
                                        label: 'Block User',
                                        value: 'blockuser',
                                        description: 'Configurer les utilisateurs interdits',

                                    }, {
                                        label: 'Block Role',
                                        value: 'blockrole',
                                        description: 'Configurer les roles interdits',

                                    }, {
                                        label: 'Allow User',
                                        value: 'allowuser',
                                        description: 'Configurer les utilisateurs autorisé',

                                    }, {
                                        label: 'Allow Role',
                                        value: 'allowrole',
                                        description: 'Configurer les roles autorisé',

                                    }, {
                                        label: 'Claim',
                                        value: 'claim',
                                        description: 'Claim le vocal temporaire',

                                    }]
                                }]
                            }
                            ]
                        })
                        // create collector
                        const collector = mess.createMessageComponentCollector({
                            filter: (i) => i.user.id === member?.id,
                            time: 1200000
                        });

                        // on collect
                        collector.on('collect', async i => {
                            if (i.customId === 'tempvocsettings') {
                                // if (i.values[0] === 'name') {

                                // }
                                // if (i.values[0] === 'limit') {

                                // }
                            }
                        })

                    })
                }
            }
            if (!oldState.channel) return;
            if (oldState.channel.id === await client.data2.get(`tempvoc_${newState.guild.id}_${newState.member?.id}`)) {
                if (oldState.channel.id === channel?.id) return;
                if (oldState.channel.members.size === 0) {
                    oldState.channel.delete(`Salon temporaire - Plus personne dans le salon`)
                    client.data2.delete(`tempvoc_${newState.guild.id}_${newState.member?.id}`)
                }
            }
        }
    }

}