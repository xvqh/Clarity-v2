import { Client } from 'discord.js';
import fs from 'fs';
import 'colors';

export default async function loadEvents(client: Client) {
    const path = `${process.cwd()}/dist/source/events`;
    const subFolders = fs.readdirSync(path);
    var eventCount = 0;

    for (const category of subFolders) {
        const eventsFiles = fs.readdirSync(`${path}/${category}`).filter(file => file.endsWith(".js"));

        for (const eventFile of eventsFiles) {

            await import(`${path}/${category}/${eventFile}`).then((data) => {
                let event = data?.default;

                if (event) {
                    client.on(event.name, (...args) => event.run(client, ...args))
                    eventCount++
                    if (category === 'anticrash') process.on(event.name, (...args) => event.run(client, ...args));
                }
            });

        }
    }

    console.log(`${eventCount} has been loaded to the core !`.green)
};