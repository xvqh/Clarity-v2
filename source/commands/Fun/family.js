module.exports = {
    name: 'family',
    run: async(client, message, args) => {
        const user =
        message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
  
        // get the family of the user
        let db = client.data.get(`family_${user.id}`) || {
            brosis: [],
            children: [],
            parent: [],
            marry: null,
        };
  
        // convert IDs to usernames
        db.brosis = db.brosis ? db.brosis.map(id => client.users.cache.get(id)?.username || id) : [];
        db.children = db.children ? db.children.map(id => client.users.cache.get(id)?.username || id) : [];
        db.parent = db.parent ? db.parent.map(id => client.users.cache.get(id)?.username || id) : [];
        db.marry = db.marry ? client.users.cache.get(db.marry)?.username || db.marry : null;
  
        message.channel.send({
            embeds: [{
                author: {
                  name: user.username,
                  icon_url: user.displayAvatarURL({ dynamic: true }),
                },
                color: parseInt(client.color.replace("#", ""), 16),
                description: `Famille de ${user.username}`,
                fields: [
                  {
                      name: "Freres/Soeurs",
                      value: `${db.brosis.join(", ")? db.brosis.join(", ") : "Aucun frere"}`,
                      inline: true
                  }, {
                      name: "Enfant",
                      value: `${db.brosis.join(", ")? db.children.join(", ") : "Aucun enfant"}`,
                      inline: true
                  }, {
                      name: "Parent",
                      value: `${db.brosis.join(", ")? db.parent.join(", ") : "Aucun parent"}`,
                      inline: true
                  }, {
                      name: "Marié",
                      value: `${db.marry || "Non marié"}`,
                      inline: true
                  }
                ]
            }]
        })
        
    }
  }
  