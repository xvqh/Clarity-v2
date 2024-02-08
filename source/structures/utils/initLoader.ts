import { Client } from "discord.js";
import fs from 'fs';

export default async (client: Client) => {
    const path = `${process.cwd()}/dist/source/structures/client/loader`;
    const files = fs.readdirSync(path);

    for (const file in files) {
        await import(`${path}/${files[file]}`).then((cmd) => {

            if (cmd?.default) {
                cmd.default(client);
            }
        })
    }
};