import fs from 'fs/promises';
import { exec } from 'child_process';

export default {
    name: "transfer",
    category: "buy",
    run: async (client, message, args) => {
        if (message.author.id != client.config.buyer) {
            return message.reply({
                content: "Vous n'avez pas la permission d'utiliser cette commande",
            });
        }
        await client.db.none(`
            CREATE TABLE IF NOT EXISTS clarity_${client.user.id}_recup (
                recupkey TEXT
            )`
        );
        const existingCode = await client.db.oneOrNone(`
            SELECT recupkey FROM clarity_${client.user.id}_recup
        `);
        if (!existingCode) {
            message.reply({ content: "Vous ne possédez pas de code de recup pour ce bot" });
        } else {
            try {
                let code = args[0];
                if (!code) {
                    return message.reply({ content: "Veuillez entrer un code de recup" });
                }
                let user = message.mentions.users.first() || client.users.cache.get(args[1]) || await client.users.fetch(args[1]).catch(() => null);
                if (!user) {
                    return message.reply({ content: "Veuillez entrer un utilisateur" });
                }
                const config = './config/config.js';
                const configContent = await fs.readFile(config, 'utf8');
                const updatedConfigContent = configContent.replace(/buyer: '(.*)'/, `buyer: '${user.id}'`);
                await fs.writeFile(config, updatedConfigContent);
                await client.db.none(`
                    DELETE FROM clarity_${client.user.id}_recup
                    WHERE recupkey = \$1`, [code]
                );
                message.reply({ content: `Votre bot : ${client.user} a bien été transféré à ${user}` }).then(() => {
                    exec(`pm2 stop gestion_${client.user.id}`, () => {
                        exec(`pm2 start gestion_${client.user.id}`, () => {
                            exec(`pm2 save`, () => {
                                exec(`pm2 restart all`);
                            });
                        });
                    });
                })
            } catch (e) {
                console.log(e);
            }
        }
    }
}
