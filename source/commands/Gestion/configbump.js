module.exports = {
    name: "configbump",
    description: "Configurer le bump",
  category: "🔨〢Gestion",
    run: async (client, message, args) => {
        if (message.author.id !== message.guild.ownerId) { 
            return message.reply({content: "Seul l owner du serveur peut configurer le bump"})} else {
        await client.db.none(`
        CREATE TABLE IF NOT EXISTS clarity_bump (
            guild_id VARCHAR(20) PRIMARY KEY,
            description TEXT
        )`);
        // configbump detail : invite du serv , description du serv 
        let msg = await message.channel.send({ content: ". . ." });
        await embed(client, message, msg);
            }
    }
};

async function embed(client, message, msg) {
    let color = parseInt(client.color.replace("#", ""), 16);
    let components = [
        {
            type: 1,
            components: [
                {
                    type: 3,
                    custom_id: "bumpconf",
                    options: [
                        {
                            label: "Description du serveur",
                            value: "description"
                        },
                    ]
                }
            ]
        }
    ];
    let embed = {
        fields: [
            {
                name: "Description du serveur",
                value: "description"
            },
        ],
        color: color,
        footer: client.config.footer
    };
    await msg.edit({
        content: null,
        embeds: [embed],
        components: components,
    });

    let question;
    let collector = msg.createMessageComponentCollector({ time: 1000 * 60 });
    collector.on("collect", async (i) => {
        if (i.user.id !== message.author.id) return i.reply({ content: "Vous ne pouvez pas configurer via un menu qui n'est pas le vôtre", ephemeral: true });
        deferUpdate()
        switch (i.values[0]) {
            case "description":
                question = await message.channel.send({ content: "Quelle est la description du serveur ?", ephemeral: true });
                const filter2 = m => m.author.id === message.author.id;
                i.channel.awaitMessages({ filter2, max: 1, time: 1000 * 60, errors: ['time'] }).then(async (cld) => {
                    cld.first().delete();
                    question.delete();
                    let description = cld.first().content;
                    
                    client.db.any(`INSERT INTO clarity_bump (guild_id, description) VALUES ($1, $2) ON CONFLICT (guild_id) DO NOTHING`, [message.guild.id, description]);
                    await msg.edit({
                        content: null,
                        embeds: [embed],
                        components: components,
                    });
                });
                break;
        }
    });
}
