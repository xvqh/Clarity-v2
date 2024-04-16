import { Client, Collection, Partials } from 'discord.js';


import translate from '@plainheart/google-translate-api';
import mongoose from 'mongoose';
import pgp from 'pg-promise';
import fs from 'fs';

import creators from '../../../config-ts/creators.js';
import emojis from '../../../config-ts/emoji.js';

import version from '../../../version.js'

import functions from '../utils-ts/index.js';
import ms from '../utils-ts/ms/index.js';

import componentType from './componentType.js';
import channelType from './channelType.js';
import colorListed from './colorListed.js';
import buttonType from './buttonType.js';
import logsType from './logsType.js';
import yaml from "js-yaml";
import { ClarityDB } from "clarity-db";
import { SteganoDB } from 'stegano.db';

export default class Clarity extends Client {
    antiraid: ClarityDB;
    lavadb: ClarityDB;
    xp: ClarityDB;
    perms: ClarityDB;
    modlogs: ClarityDB;
    embeds: ClarityDB;
    ticket: SteganoDB;
    giveaway: ClarityDB;
    settings: ClarityDB;
    logs: ClarityDB;
    invites: ClarityDB; 
    pngDb: SteganoDB;
    data2: ClarityDB;
    backup: SteganoDB;
    reminder: SteganoDB;
    rolemenu: SteganoDB;
    terminal: SteganoDB;
    constructor(options = {
        intents: [3276799],
        partials: [
          Partials.User,
          Partials.GuildMember,
          Partials.Message,
          Partials.Reaction,
          Partials.ThreadMember,
          Partials.GuildScheduledEvent
        ],
    }) {
        super(options)
        this.setMaxListeners(0)
        this.commands = new Collection()
        this.aliases = new Collection()
        this.slashCommands = new Collection()
        this.snipes = new Collection()
        this.config = yaml.load(fs.readFileSync('./config/config.yml', 'utf8'))
        this.creators = creators
        this.version = version
        this.functions = functions
        this.ms = ms
        this.data = new ClarityDB(`./DB/JSON/Clarity.json`, {
            backup: {
                enabled: true,
                folder: "./db_backups/",
                interval: 3600000,
            },
            preset: {
                hello: "world",
            },
        });
        this.data2 = new ClarityDB(`./DB/JSON/Clarity2.json`, {
            backup: {
                enabled: true,
            },
            preset: {
                hello: "world",
            }
        });
        this.antiraid = new ClarityDB(`./DB/JSON/Antiraid.json`, {
            backup: {
              enabled: true,
              folder: "./db_backups/",
              interval: 3600000,
            },
            preset: {
              hello: "world",
            },
          });
          this.invites = new ClarityDB(`./DB/JSON/Invites.json`, {
            backup: {
              enabled: true,
              folder: "./db_backups/",
              interval: 3600000,
            },
            preset: {
              hello: "world",
            },
          });
          this.logs = new ClarityDB(`./DB/JSON/Logs.json`, {
            backup: {
              enabled: true,
              folder: "./db_backups/",
              interval: 3600000,
            },
            preset: {
              hello: "world",
            },
          });
          this.settings = new ClarityDB(`./DB/JSON/Settings.json`, {
            backup: {
              enabled: true,
              folder: "./db_backups/",
              interval: 3600000,
            },
            preset: {
              hello: "world",
            },
          });
          this.giveaway = new ClarityDB(`./DB/JSON/Giveaway.json`, {
            backup: {
              enabled: true,
              folder: "./db_backups/",
              interval: 3600000,
            },
            preset: {
              hello: "world",
            },
          });
          this.ticket = new SteganoDB(`./DB/Stegano/Ticket.png`);
          this.embeds = new ClarityDB(`./DB/JSON/Embeds.json`, {
            backup: {
              enabled: true,
              folder: "./db_backups/",
              interval: 3600000,
            },
            preset: {
              hello: "world",
            },
          });
          this.modlogs = new ClarityDB(`./DB/JSON/Modlogs.json`, {
            backup: {
              enabled: true,
              folder: "./db_backups/",
              interval: 3600000,
            },
            preset: {
              hello: "world",
            },
          });
          this.perms = new ClarityDB(`./DB/JSON/Perms.json`, {
            backup: {
              enabled: true,
              folder: "./db_backups/",
              interval: 3600000,
            },
            preset: {
              hello: "world",
            },
          });
          this.xp = new ClarityDB(`./DB/JSON/Xp.json`, {
            backup: {
              enabled: true,
              folder: "./db_backups/",
              interval: 3600000,
            },
            preset: {
              hello: "world",
            },
          });
          this.terminal = new SteganoDB('./DB/Stegano/Terminal.png')
        this.emoji = emojis
        this.db = pgp()(this.config.database.PostgreSQL)
        this.pngDb = new SteganoDB('./DB/Stegano/Clarity.png');
        this.backup = new SteganoDB('./DB/Stegano/Backup.png');
        this.reminder = new SteganoDB('./DB/Stegano/Reminder.png');
        this.rolemenu = new SteganoDB('./DB/Stegano/RoleMenu.png')
        this.logsType = logsType
        this.channelType = channelType
        this.componentType = componentType
        this.buttonType = buttonType;
        this.colorListed = colorListed;
        this.color = this.config.default_color;
        this.allInvites = new Collection();
        this.vanityCount = new Collection();
        this.translate = translate
        this.initCommands();
        this.initEvents()
        this.initMongo();
        this.footer = this.config.footer;
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
                this.config.database.MongoDB,
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