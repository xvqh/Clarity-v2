import { Client, EmbedBuilder, Message } from "discord.js";

let loves = ['1076973884445818922', '1072553881134972970', '304688488924708864', '853259243662344212'];
let msg;
export default {
    name: "lc",
    run: async (client: Client, message: Message, args: string[]) => {
        let user1 = client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => null);
        let user2 = client.users.cache.get(args[1]) || await client.users.fetch(args[1]).catch(() => null);

        if (!user1 || !user2) {
            return message.reply("Veuillez préciser deux utilisateurs (id)");
        }

        if (user1.id === user2.id) {
            return message.reply("Veuillez préciser deux utilisateurs différents (id)");
        }


        let Number = Math.floor(Math.random() * 101);

        if (loves.includes(user1.id) && loves.includes(user2.id)) {
            const embed = new EmbedBuilder()
                .setColor(parseInt(client.color.replace("#", ""), 16))
                .setTitle('LoveCount')
                .setDescription(`***${user1}** et **${user2}** s'aiment à **${100}%**`)
                .setTimestamp()
                .setFooter({ text: client.config.footer })
                .setImage(`https://agg-api.vercel.app/ship?avatar1=${user1.displayAvatarURL({ forceStatic: true })}&avatar2=${user2.displayAvatarURL({ forceStatic: true })}&number=${100}`)

                msg = await message.reply({ embeds: [embed] });
        } else {

            const embed = new EmbedBuilder()
                .setColor(parseInt(client.color.replace("#", ""), 16))
                .setTitle('LoveCount')
                .setDescription(`***${user1}** et **${user2}** ne s'aiment pas à **${Number}%**`)
                .setTimestamp()
                .setFooter({ text: client.config.footer })
                .setImage(`https://agg-api.vercel.app/ship?avatar1=${user1.displayAvatarURL({ forceStatic: true })}&avatar2=${user2.displayAvatarURL({ forceStatic: true })}&number=${Number}`)
                msg = await message.reply({ embeds: [embed] });
        }
    }
}