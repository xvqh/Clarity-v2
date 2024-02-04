module.exports = {
    name: "userUpdate",
    run: async(client, oldUser, newUser) => {
        // if (oldUser.username !== newUser.username) {
        //     const tableN = `clarity_${oldUser.id}_prevname`
        //     const tableE = await client.db.oneOrNone(`SELECT to_regclass($1::text)`, [tableN])
        //     if (!tableE){
        //         await client.db.none(`
        //         CREATE TABLE IF NOT EXISTS ${tableN} (
        //             prevname TEXT,
        //             date TIMESTAMP
        //         )
        //     `).then(async () => {
        //         await client.db.none(`
        //         INSERT INTO clarity_${oldUser.id}_prevname (prevname, date) VALUES ($1, $2)
        //     `, [newUser.username, new Date()])
        //     })
        //     } else {
        //         await client.db.none(`
        //         INSERT INTO clarity_${oldUser.id}_prevname (prevname, date) VALUES ($1, $2)
        //     `, [newUser.username, new Date()])
        //     }
           
        // }
    }
}