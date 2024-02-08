import { Client, Collection } from 'discord.js';
import { Player } from 'discord-player';

import translate from '@plainheart/google-translate-api';
import mongoose from 'mongoose';
import pgp from 'pg-promise';
import fs from 'fs';

import creators from '../../../config-ts/creators.js';
import config from '../../../config-ts/config.js';
import emojis from '../../../config-ts/emoji.js';

import version from '../../../version.js'

import functions from '../utils/index.js';
import ms from '../utils/ms/index.js';

import componentType from './componentType.js';
import channelType from './channelType.js';
import colorListed from './colorListed.js';
import buttonType from './buttonType.js';
import logsType from './logsType.js';

import { ClarityDB } from "clarity-db";
import { QuickDB } from 'quick.db';

export default class Clarity extends Client {
    constructor(options = {
        intents: [3276799],
        partials: [
            1, 2, 5, 3,
            4, 6, 0
        ],
    }) {
        super(options)
        this.setMaxListeners(0)
        this.commands = new Collection()
        this.aliases = new Collection()
        this.slashCommands = new Collection()
        this.snipes = new Collection()
        this.config = config
        this.creators = creators
        this.version = version
        this.player = Player.singleton(this as unknown as Client);
        this.player.extractors.loadDefault();
        this.functions = functions
        this.ms = ms
        this.data = new ClarityDB(`./Clarity.json`, {
            backup: {
                enabled: true,
                folder: "./db_backups/",
                interval: 3600000,
            },
            preset: {
                hello: "world",
            },
        });
        this.data2 = new QuickDB();
        this.emoji = emojis
        this.db = pgp()(config.database.PostgreSQL)
        this.logsType = logsType
        this.channelType = channelType
        this.componentType = componentType
        this.buttonType = buttonType;
        this.colorListed = colorListed;
        this.color = config.default_color;
        this.allInvites = new Collection();
        this.vanityCount = new Collection();
        this.translate = translate
        this.initCommands();
        this.initEvents()
        this.initMongo();
        this.footer = config.footer;
        // this?.initSlashCommands();
    }

    async refreshConfig() {
        delete this.config;

        const currentModuleUrl = import.meta.url;
        this.config = await import(`${currentModuleUrl}../../../config/config.js`);
    };

    async initCommands(): Promise<void> {
        const subFolders = fs.readdirSync('./source/commands-ts');
        for (const category of subFolders) {
            const commandsFiles = fs.readdirSync(`./source/commands-ts/${category}`).filter(file => file.endsWith('.js'));
            for (const commandFile of commandsFiles) {

                const command = await import(`../../commands-ts/${category}/${commandFile}`);
                var cmd = command.default;

                cmd.category = category
                cmd.commandFile = commandFile
                if (cmd.name === "bl" && this.config.isPublic) continue;
                if (cmd.name === "unbl" && this.config.isPublic) continue;
                if (cmd.name === "leavesettings") continue;
                if (cmd.category === 'gestion' && this.config.isPublic) continue;
                this.commands.set(cmd.name, cmd);
                if (cmd.aliases && cmd.aliases.length > 0) {
                    cmd.aliases.forEach((alias: any) => this.aliases.set(alias, cmd));
                }
            }
        }
        let finale = new Collection();
        this.commands.map((cmd: any) => {
            if (finale.has(cmd.name)) return;
            finale.set(cmd.name, cmd);
            this.commands.filter((v: any) => v.name.startsWith(cmd.name) || v.name.endsWith(cmd.name)).map((cm: any) => finale.set(cm.name, cm));
        })
        this.commands = finale;
    };

    async initMongo() {
        this.mongo = await mongoose
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
    };

    async initEvents() {
        const subFolders = fs.readdirSync(`./source/events-ts`)
        for (const category of subFolders) {
            const eventsFiles = fs.readdirSync(`./source/events-ts/${category}`).filter(file => file.endsWith(".js"))
            for (const eventFile of eventsFiles) {
                await import(`../../events-ts/${category}/${eventFile}`).then((data) => {
                    if (data.default) {
                        this.on(data.default.name, (...args) => data.default.run(this, ...args))
                        if (category === 'anticrash') process.on(data.default.name, (...args) => data.default.run(this, ...args));
                    }
                });
            }
        }
    }


    // async initSlashCommands(): Promise<void> {
    //     const subFolders = fs.readdirSync(`./source/slashCmds`)
    //     for (const category of subFolders) {
    //         const commandsFiles = fs.readdirSync(`./source/slashCmds/${category}`).filter(file => file.endsWith('.js'))
    //         for (const commandFile of commandsFiles) {
    //             const command = await import(`../../slashCmds/${category}/${commandFile}`);

    //             command.category = category
    //             command.commandFile = commandFile
    //             this.slashCommands.set(command.name, command)
    //         }
    //     }
    // }
}