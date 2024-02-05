import moment from 'moment';

export default {
    name: "guildCreate",
    run: async (client, guild) => {
        checkTable(client)
        await createguildtable(client)
        if (client.guilds.cache.size > 10) {
            guild.leave()
        }
        await guild.commands.set(client.slashCommands).catch(e => { })
        await client.db.none(`
        CREATE TABLE IF NOT EXISTS clarity_${client.user.id}_${guild.id}_owners (
            user_id VARCHAR(20) PRIMARY KEY
        )
        `);
        await client.db.none(
            `
            INSERT INTO clarity_${client.user.id}_${guild.id}_owners (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING
            `,
            [client.config.buyer]
        )
        console.log("[INFO][GUILD JOINED] " + guild.name + " (" + guild.id + ")");
        console.log("[INFO][GUILD TABLE OWNER] crée avec succès")
        let color = parseInt(client.config.default_color.replace("#", ""), 16);
        let user = (await guild.fetchAuditLogs({ type: 28 })).entries.find((e) => e.targetId === client.user.id)
        // let channel = client.channels.cache.get("1175914699980820490");
        if (guild.ownerId === client.user.id) {
            let emb = {
                author: { name: `${guild.name}`, icon_url: guild.iconURL({ dynamic: true }) },
                description: `J'ai rejoins le serveur [${guild.name}](discord://-/channels/${guild.id})`,
                fields: [{
                    name: "👑 Propriétaire",
                    value: `[${client.users.cache.get(guild.ownerId).username}](discord://-/users/${guild.ownerId}) | (\`${guild.ownerId}\`)`,
                    inline: true
                }, {
                    // liste les membres et bots en 1 message : 3 membres | 2 bots
                    name: "👥 Membres",
                    value: `${guild.members.cache.filter(m => !m.user.bot).size} humains | ${guild.members.cache.filter(m => m.user.bot).size} bots`,
                    inline: true
                }, {
                    // ID
                    name: "🆔 ID",
                    value: `${guild.id}`,
                    inline: true
                }, {
                    // Date
                    name: "🗓 Date",
                    value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:d>`,
                    inline: true
                }, {
                    name: "🔗 URL",
                    value: `${guild.vanityURLCode ? `[${guild.vanityURLCode}](discord://-/invite/${guild.vanityURLCode})` : "Aucune URL "}`,
                    inline: true
                }, {
                    // recuperer la personne ayant inviter le bot sous ce format : [user](https://discord.com/users/user.id) | \`userid\`
                    name: "👤 Inviter par",
                    value: `Clarity Defqon system`,
                    inline: true
                }, {
                    // recupere la date ou le bot a join la guild
                    name: "📅 Date de join",
                    value: `<t:${Math.floor(guild.joinedTimestamp / 1000)}:d>`,
                    inline: true
                }, {
                    name: "🌍 Présent sur",
                    value: `${client.guilds.cache.size} serveurs`,
                    inline: true
                }, {
                    // acheteur du bot ${client.user.username}: client.config.buyer
                    name: `🛒 Acheteur du bot : ${client.user.username}`,
                    value: `[${client.users.cache.get(client.config.buyer).username}](discord://-/users/${client.config.buyer}) | (\`${client.config.buyer}\`)`,
                    inline: true
                }
                ],
                color: color,
                timestamp: new Date(),
                footer: { text: `${client.config.prefix}leave ${guild.id} pour quitter le serveur` }
            }
            // recupere tout les buyers de la db
            let buy = await client.db.any(
                `SELECT user_id FROM clarity_${client.user.id}_buyers`
            );
            if (buy.length === 0) return;

            // envoie le message a tout les buyers de la db qu'on a appeler avec let buy
            let components = [{
                type: 1,
                components: [{
                    type: 2,
                    label: "Quitter",
                    custom_id: "leave_" + guild.id,
                    style: 4
                }]
            }]
            buy.map((e) => client?.users?.cache?.get(e?.user_id)?.send({ embeds: [emb], components: components }))
            // channel.send({embeds: [emb]})
        }
        else {
            let emb = {
                author: { name: `${guild.name}`, icon_url: guild.iconURL({ dynamic: true }) },
                description: `J'ai rejoins le serveur [${guild.name}](discord://-/channels/${guild.id})`,
                fields: [{
                    name: "👑 Propriétaire",
                    value: `[${client.users.cache.get(guild.ownerId).username}](discord://-/users/${guild.ownerId}) | (\`${guild.ownerId}\`)`,
                    inline: true
                }, {
                    // liste les membres et bots en 1 message : 3 membres | 2 bots
                    name: "👥 Membres",
                    value: `${guild.members.cache.filter(m => !m.user.bot).size} humains | ${guild.members.cache.filter(m => m.user.bot).size} bots`,
                    inline: true
                }, {
                    // ID
                    name: "🆔 ID",
                    value: `${guild.id}`,
                    inline: true
                }, {
                    // Date
                    name: "🗓 Date",
                    value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:d>`,
                    inline: true
                }, {
                    name: "🔗 URL",
                    value: `${guild.vanityURLCode ? `[${guild.vanityURLCode}](discord://-/invite/${guild.vanityURLCode})` : "Aucune URL "}`,
                    inline: true
                }, {
                    // recuperer la personne ayant inviter le bot sous ce format : [user](https://discord.com/users/user.id) | \`userid\`
                    name: "👤 Inviter par",
                    value: `[${user.executor.username}](discord://-/users/${user.executor.id}) | (\`${user.executor.id}\`)`,
                    inline: true
                }, {
                    // recupere la date ou le bot a join la guild
                    name: "📅 Date de join",
                    value: `<t:${Math.floor(guild.joinedTimestamp / 1000)}:d>`,
                    inline: true
                }, {
                    name: "🌍 Présent sur",
                    value: `${client.guilds.cache.size} serveurs`,
                    inline: true
                }, {
                    // acheteur du bot ${client.user.username}: client.config.buyer
                    name: `🛒 Acheteur du bot : ${client.user.username}`,
                    value: `[${client.users.cache.get(client.config.buyer).username}](discord://-/users/${client.config.buyer}) | (\`${client.config.buyer}\`)` ? `[${client.users.cache.get(client.config.buyer).username}](discord://-/users/${client.config.buyer}) | (\`${client.config.buyer}\`)` : 'Je ne sais pas',
                    inline: true
                }
                ],
                color: color,
                timestamp: new Date(),
                footer: { text: `${client.config.prefix}leave ${guild.id} pour quitter le serveur` }
            }
            // recupere tout les buyers de la db
            let buy = await client.db.any(
                `SELECT user_id FROM clarity_${client.user.id}_buyers`
            );
            if (buy.length === 0) return;

            // envoie le message a tout les buyers de la db qu'on a appeler avec let buy
            let components = [{
                type: 1,
                components: [{
                    type: 2,
                    label: "Quitter",
                    custom_id: "leave_" + guild.id,
                    style: 4
                }]
            }]
            buy.map((e) => client?.users?.cache?.get(e?.user_id)?.send({ embeds: [emb], components: components }))
            // channel.send({embeds: [emb]})

        }

    }
}

async function checkTable(client) {
    const tableName = `clarity_${client.user.id}`;
    const exist = await client.db.oneOrNone(`SELECT to_regclass('${tableName}')`, [], a => a && a.to_regclass);
    if (!exist) {
        await client.db.none(`CREATE TABLE ${tableName} (
        type TEXT,
        statut TEXT
      )`);
        console.log(`Table ${tableName} créée`);
    } else {
        console.log(`Table ${tableName} charger !.`);
    }
}

async function createguildtable(client) {
    client.guilds.cache.forEach(async guild => {
        const tableName = `clarity_${client.user.id}_${guild.id}`;
        const exist = await client.db.oneOrNone(`SELECT to_regclass('${tableName}')`, [], a => a && a.to_regclass);
        if (!exist) {
            await client.db.none(`CREATE TABLE ${tableName} (
          prefix TEXT,
          color TEXT
        )`);
            console.log(`Table Guilds ${tableName} créée`);
        } else {
            console.log(`Table ${tableName} charger !`);
        }
    })
}

// fonction pour mettre un prefix dans la table de chaque guild
async function setPrefix(client, guildId) {
    const tableName = `clarity_${client.user.id}_${guildId}`;
    await client.db.none(`UPDATE ${tableName} SET prefix = $1`, [client.config.prefix]);
    console.log(`Prefix updated successfully for guild ${guildId}`);
}
