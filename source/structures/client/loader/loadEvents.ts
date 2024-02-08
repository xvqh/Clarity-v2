import { Client } from 'discord.js';
import fs from 'fs';

export default async function loadEvents(this: Client) {
    const path = `${process.cwd()}/source/events`;
    const subFolders = fs.readdirSync(path);

    for (const category of subFolders) {
        const eventsFiles = fs.readdirSync(`${path}/${category}`).filter(file => file.endsWith(".js"));

        for (const eventFile of eventsFiles) {

            await import(`${path}/${category}/${eventFile}`).then((data) => {
                if (data.default) {
                    this.on(data.default.name, (...args) => data.default.run(this, ...args))
                    if (category === 'anticrash') process.on(data.default.name, (...args) => data.default.run(this, ...args));
                }
            });

        }
    }
};