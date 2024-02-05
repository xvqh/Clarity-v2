import ClarityBots from './source/structures/client-ts/index.js';
const client = new ClarityBots()

process.on('uncaughtException', (err) => {
    console.log(err)
})
process.on("unhandledRejection", (err) => {
    /*if(err.code === 10062) return;
    if(err.code === 10008) return;
    if(err.code === 40060) return;// NE PAS TOUCHER !!!*/
    console.log(err)
})