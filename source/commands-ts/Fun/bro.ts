import { Client, Message } from "discord.js";

export default {
    name: "bro",
    category: "fun",
    description: "Bro command",
    usage: "bro <text>",
    run: async (client: Client, message: Message, args: string[]) => {
        const user =
        message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) {
        return message.reply(
            "vous devez mentionner la personne avec laquelle vous voulez devenir frere/soeur."
        );
    }
    if (user.bot) {
        return message.reply("vous ne pouvez pas devenir frere/soeur avec un bot.");
    }
    let db = client.data.get(`family_${message.author.id}`) || {
        brosis: [],
        children: [],
        parent: [],
        marry: null,
    };
 
    // if user is already married with the message author
    if ([...db.brosis, ...db.children, ...db.parent].some(id => id === user.id)) {
      message.reply(`${user.username} est déjà dans la même famille que vous.`);
      return;
    } else {
        const author = message.author;
        let sentM = await user.send({
           embeds: [
             {
               author: {
                  name: message.author.username,
                  icon_url: message.author.displayAvatarURL({ forceStatic: false}),
               },
               color: parseInt(client.color.replace("#", ""), 16),
               description: `${message.author.username} vous demandes en tant que frere/soeur. Cliquez sur le bouton correspondant pour accepter ou refuser la fratrie.`,
               footer: client.config.footer,
             },
           ],
           components: [
             {
               type: 1,
               components: [
                  {
                      type: 2,
                      label: "Accepter",
                      style: 3,
                      custom_id: "accepter",
                  },
                  {
                      type: 2,
                      label: "Refuser",
                      style: 4,
                      custom_id: "refuser",
                  },
               ],
             },
           ],
        });
        const collector = sentM.createMessageComponentCollector(
          { filter: (i) => i.user.id === user.id, time: 30000 }
        );
        collector.on("collect", async (i) => {
           if (i.customId.startsWith("accepter")) {
             let db1 = client.data.get(`family_${message.author.id}`) || {
               brosis: [],
               children: [],
               parent: [],
               marry: null,
             };
               db1.brosis.push(user.id)
             client.data.set(`family_${message.author.id}`, db1);
             let db2 = client.data.get(`family_${user.id}`) || {
               brosis: [],
               children: [],
               parent: [],
               marry: null,
             };
               db2.brosis.push(message.author.id)
             client.data.set(`family_${user.id}`, db2);
             i.reply({
               content: `Vous avez accepté d'etre frere/soeur avec ${author.username}`,
               ephemeral: true,
             });
             author.send({
               content: `${user.username} a accepter d'etre frere/soeur avec vous : ${author}`,
             });
             collector.stop();
           }
           if (i.customId.startsWith("refuser")) {
             i.reply({
               content: `Vous avez refuser d'etre frere/soeur avec ${author.username}`,
               ephemeral: true,
             });
             author.send({
               content: `${user.username} a refuser d'etre frere/soeur avec vous ${author}`,
             });
             collector.stop();
           }
        });
    }
    }
}