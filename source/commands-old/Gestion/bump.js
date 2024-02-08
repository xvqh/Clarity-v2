export default {
  name: "bump",
  aliases: ["bump"],
  category: "🔨〢Gestion",
  run: async (client, message) => {
    const bumpCool = await checkbumpT(client, message);
    if (bumpCool) {
      return message.reply({ content: bumpCool });
    }
    let guild = message.guild;
    const bumdb = await client.db.any(`SELECT bumplog FROM clarity_${client.user.id}_${message.guild.id}_logs`);
    const bumpLogCId = bumdb.find(channel => channel.bumplog !== null)
    if (!bumpLogCId) {
      await message.reply({ content: "Le channel bumplog n'a pas été configuré" });
    } else {
      const bumplogChannel = guild.channels.cache.get(bumpLogCId.bumplog);
      if (bumplogChannel) {
        bumplogChannel.send({ content: `${message.author.username} vient de bump le serveur !` });
      }
    }
    await bump(client, message)
    await topbumpa(client, message)
    await bumpcool(client, message)
  }
}
async function bump(client, message) {
  let color = parseInt(client.color.replace('#', ''), 16);
  // recupere l'id du serveur dans la db
  const serverId = await client.db.oneOrNone('SELECT * FROM clarity_bump WHERE guild_id = $1', [message.guild.id]);
  if (!serverId) {
    await message.reply({ content: "Serveur non enregistrer dans le systeme de bump" })
  }
  // recupere le serv support via l id du serv
  const guildSupport = client.guilds.cache.get(client.config.bumpserv)
  if (!guildSupport) {
    await message.reply({ content: "Serveur support non trouver" })
  }
  // recupere le channel bump du channel support
  const bumpChannel = guildSupport.channels.cache.get(client.config.bumpcl);
  if (!bumpChannel) {
    await message.reply({ content: "Channel bump non trouver" })
  }
  let invite = await message.channel.createInvite({})
  bumpChannel.send({
    embeds: [{
      title: `New - Bump`,
      description: `Description: ${serverId.description}\n[Invite](${invite})\nBoost: ${message.guild.premiumSubscriptionCount || '0'}\nMembres: ${message.guild.memberCount}\nOwner: ${client.users.cache.get(message.guild.ownerId).username}`,
      color: color,
      footer: client.config.footer,
      author: {
        name: message.author.username + " " + "vient de bump" + " " + message.guild.name,
        icon_url: message.author.avatarURL({ dynamic: true })
      },
      timestamp: new Date(),
      thumbnail: {
        url: message.guild.iconURL({ dynamic: true })
      }
    }],
    components: [{
      type: 1,
      components: [{
        type: 2,
        label: "Lien",
        style: 5,
        url: "discord://-/invite/" + invite
      }]
    }]
  })
}

async function topbumpa(client, message) {
  await client.db.none(`
  CREATE TABLE IF NOT EXISTS clarity_topbump (
      guild_id VARCHAR(20) PRIMARY KEY,
      user_id VARCHAR(20),
      bump_count INTEGER DEFAULT 0
  )`);

  await client.db.none(`
  INSERT INTO clarity_topbump(guild_id, user_id, bump_count)
  VALUES($1, $2, 1)
  ON CONFLICT (guild_id) DO UPDATE
  SET bump_count = clarity_topbump.bump_count + 1
`, [message.guild.id, message.author.id]);
}

async function bumpcool(client, message) {
  await client.db.none(`
  CREATE TABLE IF NOT EXISTS clarity_cooldownbump (
      guild_id VARCHAR(20) PRIMARY KEY,
      end_time TIMESTAMP WITH TIME ZONE
  )`);

  const bumpTime = new Date();
  bumpTime.setHours(bumpTime.getHours() + 2);

  await client.db.none(`
  INSERT INTO clarity_cooldownbump(guild_id, end_time)
  VALUES($1, $2)
  ON CONFLICT (guild_id) DO UPDATE
  SET end_time = \$2
`, [message.guild.id, bumpTime]);
}

async function checkbumpT(client, message) {
  const cooldown = await client.db.oneOrNone('SELECT * FROM clarity_cooldownbump WHERE guild_id = \$1', [message.guild.id]);
  if (cooldown && cooldown.end_time > new Date()) {
    const bumpt = Math.floor(cooldown.end_time.getTime() / 1000);
    const cooldownMessage = `Vous devez attendre 2 heures entre chaque bump, prochain bump autorisé <t:${bumpt}:R>`;
    return cooldownMessage;
  } else {
    return false;
  }
}