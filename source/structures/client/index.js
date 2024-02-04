const { Client, GatewayIntentBits, Collection } = require('discord.js')
const fs = require('fs')
const translate = require("@plainheart/google-translate-api")
const pgp = require('pg-promise')();
const { Player } = require('discord-player');
const config = require('../../../config/config');

module.exports = class Clarity extends Client {
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
        this.config = require('../../../config/config')
        this.creator = require("../../../config/creators")
        this.creators = require('../../../config/creators')
        this.version = require('../../../version')
        this.player = Player.singleton(this);
        this.player.extractors.loadDefault();
        this.functions = require('../utils/index')
        this.ms = require('../utils/ms')
        this.emoji = require("../../../config/emoji")
        this.db = pgp(config.database.PostgreSQL)
        this.pretty = require('pretty-ms')
        this.logsType = require('./logsType')
        this.channelType = require('./channelType')
        this.componentType = require('./componentType')
        this.buttonType = require('./buttonType')
        this.colorListed = require('./colorListed')
        this.translate = translate
        this.initCommands()
        this.initEvents()
        this.connectToToken()
    }

    async connectToToken() {
        this.login(this.config.token).then(() => {
            var x = setInterval(() => {
                if (this.ws.reconnecting || this.ws.destroyed) {
                    this.login(this.config.token).catch(e => {
                        clearInterval(x)
                        console.error("Erreur pendant la connexion au token :");
                        console.error(e);
                    })
                }
            }, 30000)
        }).catch(e => {
            console.error(e)
            if (e?.code?.toLowerCase()?.includes("token")) return;
            setTimeout(() => {
                this.connectToToken()
            }, 10000)
        })
    }
    refreshConfig() {
        delete this.config;
        delete require.cache[require.resolve('../../../config/config')];
        this.config = require('../../../config/config');
    }
    initCommands() {
        const subFolders = fs.readdirSync('./source/commands');
        for (const category of subFolders) {
            const commandsFiles = fs.readdirSync(`./source/commands/${category}`).filter(file => file.endsWith('.js'));
            for (const commandFile of commandsFiles) {
                const command = require(`../../commands/${category}/${commandFile}`);
                command.category = category
                command.commandFile = commandFile
                if (command.name === "bl" && this.config.isPublic) continue;
                if (command.name === "unbl" && this.config.isPublic) continue;
                if (command.name === "leavesettings") continue;
                if (command.category === 'gestion' && this.config.isPublic) continue;
                this.commands.set(command.name, command);
                if (command.aliases && command.aliases.length > 0) {
                    command.aliases.forEach(alias => this.aliases.set(alias, command));
                }
            }
        }
        let finale = new Collection();
        this.commands.map(cmd => {
            if (finale.has(cmd.name)) return;
            finale.set(cmd.name, cmd);
            this.commands.filter(v => v.name.startsWith(cmd.name) || v.name.endsWith(cmd.name)).map(cm => finale.set(cm.name, cm));
        })
        this.commands = finale;
    }

    initEvents() {
        const subFolders = fs.readdirSync(`./source/events`)
        for (const category of subFolders) {
            const eventsFiles = fs.readdirSync(`./source/events/${category}`).filter(file => file.endsWith(".js"))
            for (const eventFile of eventsFiles) {
                const event = require(`../../events/${category}/${eventFile}`)
                this.on(event.name, (...args) => event.run(this, ...args))
                if (category === 'anticrash') process.on(event.name, (...args) => event.run(this, ...args))
            }
        }
    }


    initSlashCommands() {
        const subFolders = fs.readdirSync(`./source/slashCmds`)
        for (const category of subFolders) {
            const commandsFiles = fs.readdirSync(`./source/slashCmds/${category}`).filter(file => file.endsWith('.js'))
            for (const commandFile of commandsFiles) {
                const command = require(`../../slashCmds/${category}/${commandFile}`)
                command.category = category
                command.commandFile = commandFile
                this.slashCommands.set(command.name, command)
            }
        }
    }
}