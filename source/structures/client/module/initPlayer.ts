import { Player } from "discord-player";
import { Client } from "discord.js";

export default async function name(client: Client) {
    client.player = Player.singleton(client);
    client.player.extractors.loadDefault();
}