import { EmbedBuilder } from "discord.js";

export default {
    name: "recup",
    description: "Génère un code de recup",
    category: "🛠️〢Buyer",
    run: async (client, message) => {
        if (message.author.id != client.config.buyer) {
            return message.reply({
                content: "Vous n'avez pas la permission d'utiliser cette commande",
            });
        }
        await client.db.none(`
          CREATE TABLE IF NOT EXISTS clarity_${client.user.id}_recup (
              recupkey TEXT
          )`);
        const existingCode = await client.db.oneOrNone(`
              SELECT recupkey FROM clarity_${client.user.id}_recup
          `);
        if (existingCode) {
            let m = message.reply({ content: "Vous avez déja un code de recup , il vous a été re envoyer en mp" })
            message.author.send({
                embeds: [new EmbedBuilder({
                    description: `Votre code est : ${existingCode.recupkey}`,
                    color: parseInt(client.color.replace("#", ""), 16),
                    footer: client.config.footer,
                    timestamp: new Date()
                })],
            })
            m.delete();
        } else {
            let msg = await message.channel.send({ content: "Génération du code en cours . . ." })
            await update(client, message, msg)
        }
    }
}
async function update(client, message, msg) {
    let code = Math.random().toString(36).slice(2)
    msg.edit({
        content: null,
        embeds: [new EmbedBuilder({
            description: `Votre code vient d'être générer dans vos mp`,
            color: parseInt(client.color.replace("#", ""), 16),
            footer: client.config.footer,
            timestamp: new Date()
        })]
    })
    await client.db.none(`
    INSERT INTO clarity_${client.user.id}_recup (recupkey) VALUES ($1)
    `, [code])
    message.author.send({
        embeds: [new EmbedBuilder({
            title: "Recup - Key Génération",
            description: `Votre code est : ${code}`,
            color: parseInt(client.color.replace("#", ""), 16),
            footer: client.config.footer,
            timestamp: new Date()
        })],
    })
}