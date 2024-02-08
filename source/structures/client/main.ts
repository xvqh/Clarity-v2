import { Client, Collection } from 'discord.js';
import { ClarityDB } from "clarity-db";
import { QuickDB } from 'quick.db';

import translate from '@plainheart/google-translate-api';
import pgp from 'pg-promise';

import creators from '../../../config/creators.js';
import config from '../../../config/config.js';
import emojis from '../../../config/emoji.js';

import version from '../../../version.js'
import functions from '../utils/method.js';
import ms from '../utils/ms/index.js';

import componentType from './componentType.js';
import channelType from './channelType.js';
import colorListed from './colorListed.js';
import buttonType from './buttonType.js';
import logsType from './logsType.js';
import initMongo from './database/initMongo.js';
import initLoader from '../utils/initLoader.js';

export default async (client: Client) => {
    client.setMaxListeners(0)
    client.aliases = new Collection()
    client.slashCommands = new Collection()
    client.snipes = new Collection()
    client.config = config
    client.creators = creators
    client.version = version
    client.functions = functions
    client.ms = ms
    client.data = new ClarityDB(`./Clarity.json`, {
        backup: {
            enabled: true,
            folder: "./db_backups/",
            interval: 3600000,
        },
        preset: {
            hello: "world",
        },
    });
    client.data2 = new QuickDB();
    client.emoji = emojis
    client.db = pgp()(config.database.PostgreSQL)
    client.logsType = logsType
    client.channelType = channelType
    client.componentType = componentType
    client.buttonType = buttonType;
    client.colorListed = colorListed;
    client.color = config.default_color;
    client.allInvites = new Collection();
    client.vanityCount = new Collection();
    client.translate = translate
    client.footer = config.footer;
    client.commands = new Collection();
    
    initMongo(client);

    initLoader(client).then(() => {
        client.login(config.token);
    });
};
