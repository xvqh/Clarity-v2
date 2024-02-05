import moment from "moment";

export default {
    name: "buyerinfo",
    description: "Buyer Info",
    category: "Info",
    usage: "buyerinfo",
    run: async (client, message) => {
        const buyer = client.users.cache.get(client.config.buyer);
        message.channel.send({
            embeds: [{
                color: parseInt(client.color.replace("#", ""), 16),
                title: "Buyer info",
                fields: [{
                    name: "ID",
                    value: buyer.id
                }, {
                    name: "Username",
                    value: buyer.username
                }, {
                    name: "Compte crée le",
                    value: moment(buyer.createdAt).format("DD/MM/YYYY")
                }],
                footer: client.config.footer,
                timestamp: new Date(),
                image: {
                    url: buyer.displayAvatarURL({ dynamic: true })
                }
            }]
        })
    }
}