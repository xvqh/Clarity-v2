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
import { Client } from "discord.js";

export default {
  name: 'ready',
  run: async (client: Client) => {
    console.clear();
    checkTable(client)
    createguildtable(client)
    client.guilds.cache.forEach(async (g) => {
      // if (g.memberCount <= 30) {
      //   g.leave()
      //   console.log(g.name + " " + "leave")
      // }
      await client.db.none(`
      CREATE TABLE IF NOT EXISTS clarity_${client.user?.id}_${g.id}_owners (
          user_id VARCHAR(20) PRIMARY KEY
      )`);
      await client.db.none(
        `
    INSERT INTO clarity_${client.user?.id}_${g.id}_owners (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING
    `,
        [client.config.buyer]
      );
      console.log("[DB]" + " " + g.name + " " + "update")
      console.log(client.users.cache.get(client.config.buyer)?.username + " " + " Ajouté a la table owner de: " + g.name)
    })
    // client.users.cache.forEach(async (u) => {
    //   if (!u.bot) {
    //       try {
    //           delUserPrevnameTable(client, u.id)
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




    console.log(`[BOT]: ${client.user?.username} est connecté à ${getNow().time}`);
    console.log(`[GUILDS]: ${client.guilds.cache.size}`);
    console.log(`[CHANNELS]: ${client.channels.cache.size}`);
    console.log(`[USERS] ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0).toLocaleString()}`);
    console.log("-------------------------------");
    console.log("[DB]" + ' ' + client.user?.username + ' ' + "DB READY");
    console.log(`[SCRIPT]: Clarity est connecté au bot (${client.user?.username})`)
    console.log("-------------------------------");
    createBotStatusTable(client)

    client.db.one(`SELECT * FROM clarity_${client.user?.id}_bot_status`).then((req: any) => {
      if (req === null) {
        setBotStatus(client);
      }
      if (req.type == 'stream') {
        client.user?.setPresence({ activities: [{ name: `${req.status}`, type: 1, url: "https://twitch.tv/tsubasa_poulpy" }], status: req.presence ? req.presence : 'dnd' });
      }
      if (req.type == 'play') {
        client.user?.setPresence({ activities: [{ name: `${req.status}`, type: 0 }], status: req.presence ? req.presence : 'dnd' });
      }
      if (req.type == 'listen') {
        client.user?.setPresence({ activities: [{ name: `${req.status}`, type: 2 }], status: req.presence ? req.presence : 'dnd' });
      }
      if (req.type == 'watch') {
        client.user?.setPresence({ activities: [{ name: `${req.status}`, type: 3 }], status: req.presence ? req.presence : 'dnd' });
      }
      if (req.type == 'custom') {
        client.user?.setPresence({ activities: [{ name: `${req.status}`, type: 4 }], status: req.presence ? req.presence : 'dnd' });
      }
      if (req.type == 'compet') {
        client.user?.setPresence({ activities: [{ name: `${req.status}`, type: 5 }], status: req.presence ? req.presence : 'dnd' });
      }
    })
      .catch((error: any) => {
        if (error.message === "No data returned from the query.") {
          setBotStatus(client);
          return;
        }
        console.error(error);
      });

  }


}


async function checkTable(client: Client) {
  const tableName = `clarity_${client.user?.id}`;
  const exist = await client.db.oneOrNone(`SELECT to_regclass('${tableName}')`, [], (a: any) => a && a.to_regclass);
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

async function createguildtable(client: Client) {
  client.guilds.cache.forEach(async guild => {
    const tableName = `clarity_${client.user?.id}_${guild.id}`;
    const exist = await client.db.oneOrNone(`SELECT to_regclass('${tableName}')`, [], (a: any) => a && a.to_regclass);
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

// fonction pour cree la table bot_status et mettre un status de base
async function createBotStatusTable(client: Client) {
  const tableName = `clarity_${client.user?.id}_bot_status`;
  const exist = await client.db.oneOrNone(`SELECT to_regclass('${tableName}')`, [], (a: any) => a && a.to_regclass);
  if (!exist) {
    await client.db.none(`CREATE TABLE ${tableName} (
      type TEXT,
      status TEXT,
      presence TEXT
    )`);
    console.log(`Table ${tableName} créée`);
  } else {
    console.log(`Table ${tableName} charger !`);
  }
}
// fonction pour injecter dans la table bot_status le status du bot de base si aucun status n'est mis
async function setBotStatus(client: Client) {
  const tableName = `clarity_${client.user?.id}_bot_status`;
  await client.db.none(`INSERT INTO ${tableName} (type, status, presence) VALUES ($1, $2, $3)`, ['custom', `Clarity ${client.version.version}`, 'dnd']);
  console.log(`Bot status updated successfully for ${tableName} and the bot ${client.user?.username}`);
}
// fonction pour mettre un prefix dans la table de chaque guild
async function setPrefix(client: Client, guildId: string) {
  const tableName = `clarity_${client.user?.id}_${guildId}`;
  await client.db.none(`UPDATE ${tableName} SET prefix = $1`, [client.config.prefix]);
  console.log(`Prefix updated successfully for guild ${guildId}`);
}
async function createUserPrevnameTable(client: Client, userId: string) {
  const tableName = `clarity_${userId}_prevname`;
  const exist = await client.db.oneOrNone(`SELECT to_regclass('${tableName}')`, [], (a: any) => a && a.to_regclass);
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
async function newUserPrevname(client: Client, userId: string, prevname: string) {
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

async function delUserPrevnameTable(client: Client, userId: string) {
  const tableName = `clarity_${userId}_prevname`;
  await client.db.none(`DROP TABLE IF EXISTS ${tableName}`);
  console.log(`User prevname table ${tableName} deleted`);
}