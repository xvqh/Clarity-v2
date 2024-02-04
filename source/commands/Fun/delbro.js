module.exports = {
    name: "delbrosis",
    run: async (client, message, args) => {
    let db = client.data.get(`family_${message.author.id}`) || {
      brosis: [],
      children: [],
      parent: [],
      marry: null,
    };
   
    // Reset the brosis array
    db.brosis = [];
   
    // Save the updated data
    client.data.set(`family_${message.author.id}`, db);
   
    message.reply("Tous les frere/soeur ont été supprimés.");
    },
   };
   