import config from "../../../../config/config.js";

import { Client } from "discord.js";
import mongoose from 'mongoose';

export default async (client: Client) => {

    client.mongo = await mongoose
        .connect(
            config.database.MongoDB,
        )
        .then(() => {
            console.log("[MongoDB] Connected");
        })
        .catch((e) => {
            console.error("[MongoDB] Error");
            console.error(e);
        });
}