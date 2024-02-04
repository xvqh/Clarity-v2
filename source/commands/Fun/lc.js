let loves = ['1076973884445818922', '1072553881134972970', '304688488924708864', '853259243662344212'];
let msg;
module.exports = {
    name: "lc",
    run: async (client, message, args) => {
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
            msg = await message.channel.send({
                embeds: [{
                    title: 'LoveCount',
                    color: parseInt(client.color.replace("#", ""), 16),
                    description: `**${user1}** et **${user2}** s'aiment à **${100}%**`,
                    image: {
                        url: `https://agg-api.vercel.app/ship?avatar1=${user1.displayAvatarURL({ format: "png" })}&avatar2=${user2.displayAvatarURL({ format: "png" })}&number=${100}`,
                    },
                    footer: {
                        text: client.config.footer.text
                    }
                }]
            });
        } else {
            msg = await message.channel.send({
                embeds: [{
                    title: 'LoveCount',
                    color: parseInt(client.color.replace("#", ""), 16),
                    description: `**${user1}** et **${user2}** s'aiment à **${Number}%**`,
                    image: {
                        url: `https://agg-api.vercel.app/ship?avatar1=${user1.displayAvatarURL({ format: "png" })}&avatar2=${user2.displayAvatarURL({ format: "png" })}&number=${Number}`,
                    },
                    footer: {
                        text: client.config.footer.text
                    }
                }]
            });
        }

      
    }
};
