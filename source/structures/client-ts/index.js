"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var google_translate_api_1 = require("@plainheart/google-translate-api");
var mongoose_1 = require("mongoose");
var pg_promise_1 = require("pg-promise");
var fs_1 = require("fs");
var creators_js_1 = require("../../../config-ts/creators.js");
var emoji_js_1 = require("../../../config-ts/emoji.js");
var version_js_1 = require("../../../version.js");
var index_js_1 = require("../utils-ts/index.js");
var index_js_2 = require("../utils-ts/ms/index.js");
var componentType_js_1 = require("./componentType.js");
var channelType_js_1 = require("./channelType.js");
var colorListed_js_1 = require("./colorListed.js");
var buttonType_js_1 = require("./buttonType.js");
var logsType_js_1 = require("./logsType.js");
var js_yaml_1 = require("js-yaml");
var clarity_db_1 = require("clarity-db");
var stegano_db_1 = require("stegano.db");
var Clarity = /** @class */ (function (_super) {
    __extends(Clarity, _super);
    function Clarity(options) {
        if (options === void 0) { options = {
            intents: [3276799],
            partials: [
                discord_js_1.Partials.User,
                discord_js_1.Partials.GuildMember,
                discord_js_1.Partials.Message,
                discord_js_1.Partials.Reaction,
                discord_js_1.Partials.ThreadMember,
                discord_js_1.Partials.GuildScheduledEvent
            ],
        }; }
        var _this = _super.call(this, options) || this;
        _this.setMaxListeners(0);
        _this.commands = new discord_js_1.Collection();
        _this.aliases = new discord_js_1.Collection();
        _this.slashCommands = new discord_js_1.Collection();
        _this.snipes = new discord_js_1.Collection();
        _this.config = js_yaml_1.default.load(fs_1.default.readFileSync('./config/config.yml', 'utf8'));
        _this.creators = creators_js_1.default;
        _this.version = version_js_1.default;
        _this.functions = index_js_1.default;
        _this.ms = index_js_2.default;
        _this.data = new clarity_db_1.ClarityDB("./DB/JSON/Clarity.json", {
            backup: {
                enabled: true,
                folder: "./db_backups/",
                interval: 3600000,
            },
            preset: {
                hello: "world",
            },
        });
        _this.data2 = new clarity_db_1.ClarityDB("./DB/JSON/Clarity2.json", {
            backup: {
                enabled: true,
            },
            preset: {
                hello: "world",
            }
        });
        _this.antiraid = new clarity_db_1.ClarityDB("./DB/JSON/Antiraid.json", {
            backup: {
                enabled: true,
                folder: "./db_backups/",
                interval: 3600000,
            },
            preset: {
                hello: "world",
            },
        });
        _this.invites = new clarity_db_1.ClarityDB("./DB/JSON/Invites.json", {
            backup: {
                enabled: true,
                folder: "./db_backups/",
                interval: 3600000,
            },
            preset: {
                hello: "world",
            },
        });
        _this.logs = new clarity_db_1.ClarityDB("./DB/JSON/Logs.json", {
            backup: {
                enabled: true,
                folder: "./db_backups/",
                interval: 3600000,
            },
            preset: {
                hello: "world",
            },
        });
        _this.settings = new clarity_db_1.ClarityDB("./DB/JSON/Settings.json", {
            backup: {
                enabled: true,
                folder: "./db_backups/",
                interval: 3600000,
            },
            preset: {
                hello: "world",
            },
        });
        _this.giveaway = new clarity_db_1.ClarityDB("./DB/JSON/Giveaway.json", {
            backup: {
                enabled: true,
                folder: "./db_backups/",
                interval: 3600000,
            },
            preset: {
                hello: "world",
            },
        });
        _this.ticket = new clarity_db_1.ClarityDB("./DB/JSON/Ticket.json", {
            backup: {
                enabled: true,
                folder: "./db_backups/",
                interval: 3600000,
            },
            preset: {
                hello: "world",
            },
        });
        _this.embeds = new clarity_db_1.ClarityDB("./DB/JSON/Embeds.json", {
            backup: {
                enabled: true,
                folder: "./db_backups/",
                interval: 3600000,
            },
            preset: {
                hello: "world",
            },
        });
        _this.modlogs = new clarity_db_1.ClarityDB("./DB/JSON/Modlogs.json", {
            backup: {
                enabled: true,
                folder: "./db_backups/",
                interval: 3600000,
            },
            preset: {
                hello: "world",
            },
        });
        _this.perms = new clarity_db_1.ClarityDB("./DB/JSON/Perms.json", {
            backup: {
                enabled: true,
                folder: "./db_backups/",
                interval: 3600000,
            },
            preset: {
                hello: "world",
            },
        });
        _this.xp = new clarity_db_1.ClarityDB("./DB/JSON/Xp.json", {
            backup: {
                enabled: true,
                folder: "./db_backups/",
                interval: 3600000,
            },
            preset: {
                hello: "world",
            },
        });
        _this.emoji = emoji_js_1.default;
        _this.db = (0, pg_promise_1.default)()(_this.config.database.PostgreSQL);
        _this.pngDb = new stegano_db_1.SteganoDB('./DB/Stegano/Clarity.png');
        _this.logsType = logsType_js_1.default;
        _this.channelType = channelType_js_1.default;
        _this.componentType = componentType_js_1.default;
        _this.buttonType = buttonType_js_1.default;
        _this.colorListed = colorListed_js_1.default;
        _this.color = _this.config.default_color;
        _this.allInvites = new discord_js_1.Collection();
        _this.vanityCount = new discord_js_1.Collection();
        _this.translate = google_translate_api_1.default;
        _this.initCommands();
        _this.initEvents();
        _this.initMongo();
        _this.footer = _this.config.footer;
        return _this;
        // this?.initSlashCommands();
    }
    Clarity.prototype.refreshConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var currentModuleUrl, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        delete this.config;
                        currentModuleUrl = import.meta.url;
                        _a = this;
                        return [4 /*yield*/, Promise.resolve("".concat("".concat(currentModuleUrl, "../../../config/config.js"))).then(function (s) { return require(s); })];
                    case 1:
                        _a.config = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    Clarity.prototype.initCommands = function () {
        return __awaiter(this, void 0, void 0, function () {
            var subFolders, _i, subFolders_1, category, commandsFiles, _a, commandsFiles_1, commandFile, command, cmd, finale;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        subFolders = fs_1.default.readdirSync('./source/commands-ts');
                        _i = 0, subFolders_1 = subFolders;
                        _b.label = 1;
                    case 1:
                        if (!(_i < subFolders_1.length)) return [3 /*break*/, 6];
                        category = subFolders_1[_i];
                        commandsFiles = fs_1.default.readdirSync("./source/commands-ts/".concat(category)).filter(function (file) { return file.endsWith('.js'); });
                        _a = 0, commandsFiles_1 = commandsFiles;
                        _b.label = 2;
                    case 2:
                        if (!(_a < commandsFiles_1.length)) return [3 /*break*/, 5];
                        commandFile = commandsFiles_1[_a];
                        return [4 /*yield*/, Promise.resolve("".concat("../../commands-ts/".concat(category, "/").concat(commandFile))).then(function (s) { return require(s); })];
                    case 3:
                        command = _b.sent();
                        cmd = command.default;
                        cmd.category = category;
                        cmd.commandFile = commandFile;
                        if (cmd.name === "bl" && this.config.isPublic)
                            return [3 /*break*/, 4];
                        if (cmd.name === "unbl" && this.config.isPublic)
                            return [3 /*break*/, 4];
                        if (cmd.name === "leavesettings")
                            return [3 /*break*/, 4];
                        if (cmd.category === 'gestion' && this.config.isPublic)
                            return [3 /*break*/, 4];
                        this.commands.set(cmd.name, cmd);
                        if (cmd.aliases && cmd.aliases.length > 0) {
                            cmd.aliases.forEach(function (alias) { return _this.aliases.set(alias, cmd); });
                        }
                        _b.label = 4;
                    case 4:
                        _a++;
                        return [3 /*break*/, 2];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6:
                        finale = new discord_js_1.Collection();
                        this.commands.map(function (cmd) {
                            if (finale.has(cmd.name))
                                return;
                            finale.set(cmd.name, cmd);
                            _this.commands.filter(function (v) { return v.name.startsWith(cmd.name) || v.name.endsWith(cmd.name); }).map(function (cm) { return finale.set(cm.name, cm); });
                        });
                        this.commands = finale;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    Clarity.prototype.initMongo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, mongoose_1.default
                                .connect(this.config.database.MongoDB)
                                .then(function () {
                                console.log("[MongoDB] Connected");
                            })
                                .catch(function (e) {
                                console.error("[MongoDB] Error");
                                console.error(e);
                            })];
                    case 1:
                        _a.mongo = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    Clarity.prototype.initEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var subFolders, _loop_1, _i, subFolders_2, category;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        subFolders = fs_1.default.readdirSync("./source/events-ts");
                        _loop_1 = function (category) {
                            var eventsFiles, _b, eventsFiles_1, eventFile;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        eventsFiles = fs_1.default.readdirSync("./source/events-ts/".concat(category)).filter(function (file) { return file.endsWith(".js"); });
                                        _b = 0, eventsFiles_1 = eventsFiles;
                                        _c.label = 1;
                                    case 1:
                                        if (!(_b < eventsFiles_1.length)) return [3 /*break*/, 4];
                                        eventFile = eventsFiles_1[_b];
                                        return [4 /*yield*/, Promise.resolve("".concat("../../events-ts/".concat(category, "/").concat(eventFile))).then(function (s) { return require(s); }).then(function (data) {
                                                if (data.default) {
                                                    _this.on(data.default.name, function () {
                                                        var _a;
                                                        var args = [];
                                                        for (var _i = 0; _i < arguments.length; _i++) {
                                                            args[_i] = arguments[_i];
                                                        }
                                                        return (_a = data.default).run.apply(_a, __spreadArray([_this], args, false));
                                                    });
                                                    if (category === 'anticrash')
                                                        process.on(data.default.name, function () {
                                                            var _a;
                                                            var args = [];
                                                            for (var _i = 0; _i < arguments.length; _i++) {
                                                                args[_i] = arguments[_i];
                                                            }
                                                            return (_a = data.default).run.apply(_a, __spreadArray([_this], args, false));
                                                        });
                                                }
                                            })];
                                    case 2:
                                        _c.sent();
                                        _c.label = 3;
                                    case 3:
                                        _b++;
                                        return [3 /*break*/, 1];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, subFolders_2 = subFolders;
                        _a.label = 1;
                    case 1:
                        if (!(_i < subFolders_2.length)) return [3 /*break*/, 4];
                        category = subFolders_2[_i];
                        return [5 /*yield**/, _loop_1(category)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Clarity;
}(discord_js_1.Client));
exports.default = Clarity;
