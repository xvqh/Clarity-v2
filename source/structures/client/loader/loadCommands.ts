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

            client.commands.set(cmd.name, cmd);

            if (cmd.aliases && cmd.aliases.length > 0) {
                cmd.aliases.forEach((alias: any) => client.aliases.set(alias, cmd));
            }
        }

    };
};
