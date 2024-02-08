import { Client, Collection } from 'discord.js';
import fs from 'fs';

export default async function initCommands(client: Client): Promise<void> {
    const path = `${process.cwd()}/dist/source/commands`;
    const subFolders = fs.readdirSync(path);

    for (const category of subFolders) {
        const commandsFiles = fs.readdirSync(`${path}/${category}`).filter(file => file.endsWith('.js'));

        for (const commandFile of commandsFiles) {
            const command = await import(`${path}/${category}/${commandFile}`).then((command) => command);

            var cmd = command.default;

            cmd.category = category
            cmd.commandFile = commandFile

            console.log(client.commands);
            client.commands.set(cmd.name, cmd);

            if (cmd.aliases && cmd.aliases.length > 0) {
                cmd.aliases.forEach((alias: any) => client.aliases.set(alias, cmd));
            }
        }

    }

    let finale = new Collection();

    // console.log(finale, client.commands);

    // client.commands.map((cmd: any) => {
    //     if (finale.has(cmd.name)) return;
    //     finale.set(cmd.name, cmd);
    //     client.commands.filter((v: any) => v.name.startsWith(cmd.name) || v.name.endsWith(cmd.name)).map((cm: any) => finale.set(cm.name, cm));
    // })
    // client.commands = finale;
};
