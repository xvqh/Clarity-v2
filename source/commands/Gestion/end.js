module.exports = {
    name: "end",
    aliases: ["gwend", "giveawayend"],
    run: async (client, message, args) => {
      
        const uniqueIdentifier = args[0];
        if (!uniqueIdentifier) {
            return message.reply(`Utilisation incorrecte.`);
        }
        const giveawayKeys = client.data.all().filter(entry => entry.ID.startsWith(`giveaway`));
        let giveawayData = null;
        let gwkey = null;
        giveawayKeys.forEach(entry => {
            const datas = entry.data;
            const data = JSON.parse(datas)
            if (data.messageid === uniqueIdentifier) {
                giveawayData = data;
                gwkey = entry.ID
            }
        });
        if (!giveawayData) {
            return message.reply("Ce giveaway n'existe pas.");
        }

        if (giveawayData.ended) {
            return message.reply("Ce giveaway est déjà terminé.");
        }

        giveawayData.temps = Date.now() + 1000;
        client.data.set(`${gwkey}`, giveawayData);

        return message.channel.send(`Le giveaway (ID: ${uniqueIdentifier}) a été terminé. Félicitations aux gagnants !`);
    }
};