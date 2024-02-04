const Discord = require('discord.js');
const getNow = () => {
  return {
    time: new Date().toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    })
  };
};
const Clarity = require('../../structures/client/index');
module.exports = {
    name: 'ready',
    /**
    *
    * @param {Clarity} client
    * @return 
    * 
    */
   run: async(client) => {
    console.clear();
    checkTable(client)
    createguildtable(client)
    client.guilds.cache.forEach(async (g) => {
      // if (g.memberCount <= 30) {
      //   g.leave()
      //   console.log(g.name + " " + "leave")
      // }
      await client.db.none(`
      CREATE TABLE IF NOT EXISTS clarity_${client.user.id}_${g.id}_owners (
          user_id VARCHAR(20) PRIMARY KEY
      )`);
  await client.db.none(
  `
    INSERT INTO clarity_${client.user.id}_${g.id}_owners (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING
    `,
  [client.config.buyer]
  );
  console.log("[DB]" + " " + g.name + " " + "update")
  console.log(client.users.cache.get(client.config.buyer).username + " " + " Ajouté a la table owner de: " + g.name) 
  })
  // client.users.cache.forEach(async (u) => {
  //   if (!u.bot) {
  //       try {
            // delUserPrevnameTable(client, u.id)
  //           createUserPrevnameTable(client, u.id)
  //           .then(async () => {
  //             const existingPrevname = await client.db.oneOrNone(`
  //             SELECT prevname FROM clarity_${u.id}_prevname
  //             WHERE prevname = \$1
  //           `, u.username);
            
  //           if (!existingPrevname) {
  //             await newUserPrevname(client, u.id, u.username);
  //           }
  //           })
  //           .catch(console.error);
  //         } catch (error) {
  //           console.error(error);
  //     }
  //   }
  // })


    
   
    console.log(`[BOT]: ${client.user.username} est connecté à ${getNow().time}`);
    console.log(`[GUILDS]: ${client.guilds.cache.size}`);
    console.log(`[CHANNELS]: ${client.channels.cache.size}`);
    console.log(`[USERS] ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0).toLocaleString()}`);
    console.log(`[SCRIPT]: Clarity est connecté au bot (${client.user.username})`)
    console.log("-------------------------------");

     client.db.one(`SELECT * FROM clarity_${client.user.id}`).then(req => {
      if(req === null) {
        client.user.setPresence({activities: [{name: `Clarity V2`, type: 0}], status: "dnd"});
      }
    if(req.type == 'Streaming') {
      client.user.setPresence({activities: [{name: `${req.statut}`, type: 1 , url: "https://twitch.tv/tsubasa_dsc"}]});
    }
    if (req.type == 'Playing') {
      client.user.setPresence({activities: [{name: `${req.statut}`, type: 0}]});
    }
    if (req.type == 'Listening'){
      client.user.setPresence({activities: [{name: `${req.statut}`, type: 2}]});
    }
    if (req.type == 'Watching'){
      client.user.setPresence({activities: [{name: `${req.statut}`, type: 3}]});
    }
    if (req.type == 'Competing'){
      client.user.setPresence({activities: [{name: `${req.statut}`, type: 5}]});
    }
    if (req.status === "dnd") {
      client.user.setPresence({status: "dnd"});
    }
    if (req.status === "online") {
      client.user.setPresence({status: "online"});
    }
    if (req.status === "idle") {
      client.user.setPresence({status: "idle"});
    }
    if (req.status === "invisible") {
      client.user.setPresence({status: "invisible"});
    }
     })
     .catch(error => {
      if(error.message === "No data returned from the query."){
        client.user.setPresence({activities: [{name: `Clarity V2`, type: 0}], status: "dnd"});
        return;
      }
      console.error(error);
    });

   }

   
}


async function checkTable(client) {
  const tableName = `clarity_${client.user.id}`;
  const exist = await client.db.oneOrNone(`SELECT to_regclass('${tableName}')`, [], a => a && a.to_regclass);
  if (!exist) {
    await client.db.none(`CREATE TABLE ${tableName} (
      type TEXT,
      statut TEXT
    )`);
    console.log(`Table ${tableName} créée`);
  } else {
    console.log(`Table ${tableName} charger !.`);
  }
}

async function createguildtable(client) {
  client.guilds.cache.forEach(async guild => {
    const tableName = `clarity_${client.user.id}_${guild.id}`;
    const exist = await client.db.oneOrNone(`SELECT to_regclass('${tableName}')`, [], a => a && a.to_regclass);
    if (!exist) {
      await client.db.none(`CREATE TABLE ${tableName} (
        prefix TEXT,
        color TEXT
      )`);
      console.log(`Table Guilds ${tableName} créée`);
    } else {
      console.log(`Table ${tableName} charger !`);
    }
  })
}

// fonction pour mettre un prefix dans la table de chaque guild
async function setPrefix(client, guildId) {
  const tableName = `clarity_${client.user.id}_${guildId}`;
  await client.db.none(`UPDATE ${tableName} SET prefix = $1`, [client.config.prefix]);
  console.log(`Prefix updated successfully for guild ${guildId}`);
}
async function createUserPrevnameTable(client, userId) {
  const tableName = `clarity_${userId}_prevname`;
  const exist = await client.db.oneOrNone(`SELECT to_regclass('${tableName}')`, [], a => a && a.to_regclass);
  if (!exist) {
    await client.db.none(`
      CREATE TABLE IF NOT EXISTS ${tableName} (
        prevname TEXT,
        date TIMESTAMP
      )`);
    console.log(`User prevname table ${tableName} created`);
  } else {
    console.log(`User prevname table ${tableName} already exists`);
  }
}
async function newUserPrevname(client, userId, prevname) {
  const globalExist = await client.db.oneOrNone(`
    SELECT prevname FROM clarity_${userId}_prevname
    WHERE prevname = \$1
  `, prevname);
  
  if (globalExist) {
    console.log(`Prevname ${prevname} already exists in a user prevname table`);
    return;
  }
  
  const tableName = `clarity_${userId}_prevname`;
  
  // Insérer le prevname dans la table
  await client.db.none(`
    INSERT INTO ${tableName} (prevname, date) 
    VALUES (\$1, \$2)
  `, [prevname, new Date()]);
  
  console.log(`Prevname ${prevname} added to table ${tableName}`);
}

async function delUserPrevnameTable(client, userId) {
  const tableName = `clarity_${userId}_prevname`;
  await client.db.none(`DROP TABLE IF EXISTS ${tableName}`);
  console.log(`User prevname table ${tableName} deleted`);
}