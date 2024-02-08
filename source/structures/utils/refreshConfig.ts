import { Client } from "discord.js";

export default async (client: Client) => {
    delete client.config;

    const currentModuleUrl = import.meta.url;
    client.config = await import(`${currentModuleUrl}../../../config/config.js`);
}