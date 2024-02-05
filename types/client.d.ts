import { Client, Collection } from 'discord.js';
import config from '../config/config';
import version from '../version';
import { singleton } from 'discord-player';
import ms from '../utils/ms/index.js';
import ClarityDB from 'clarity-db';
import { QuickDB } from 'quick.db';
import emoji from '../config/emoji.js';
import pgp from 'pg-promise';
import pretty from 'pretty-ms';

import translate from '@plainheart/google-translate-api';

import buttonType from '../source/structures/client/buttonType';
import logsType from '../source/structures/client/logsType';

declare module 'discord.js' {
    export interface Client {
        setMaxListeners: Function;
        commands: Collection;
        aliases: Collection;
        slashCommands: Collection;
        snipes: Collection;
        config: config;
        creators: creators;
        version: version;
        player: singleton;
        functions: Function;
        ms: ms;
        data: ClarityDB;
        data2: QuickDB;
        emoji: emoji;
        db: pgp;
        pretty: pretty;
        logsType: logsType
        channelType: channelType
        componentType: componentType
        buttonType: buttonType
        colorListed: colorListed
        allInvites: Collection;
        vanityCount: Collection;
        translate: translate;
        initCommands: Client<boolean>;
        initEvents: Function;
        connectToToken: Promise<void>;
        initMongo: Function;
        initSlashCommands: Promise<void>;
        mongo: mongoose
    }
}