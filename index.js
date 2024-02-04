const ClarityBots = require('./source/structures/client')

const client = new ClarityBots()

process.on("unhandledRejection", (err)=> {
    /*if(err.code === 10062) return;
    if(err.code === 10008) return;
    if(err.code === 40060) return;// NE PAS TOUCHER !!!*/
    console.log(err)
})