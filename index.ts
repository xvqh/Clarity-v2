import config from './config/config.js';
import { ShardingManager } from 'discord.js';
import 'colors';

// process.on('uncaughtException', (err) => {
//     console.log(err)
// })
// process.on("unhandledRejection", (err) => {
//     /*if(err.code === 10062) return;
//     if(err.code === 10008) return;
//     if(err.code === 40060) return;// NE PAS TOUCHER !!!*/
//     console.log(err)
// })

const manager = new ShardingManager('./dist/source/structures/client/bot.js', { totalShards: "auto", token: config.token });
manager.on('shardCreate', (shard) => {
    console.log(`The shard number ${shard.id} is launched !`.green);
});
manager.spawn();