"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = require("moment");
exports.default = {
    sleep: function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); },
    dateToEpoch: function (date) {
        return date.getTime() / 1000;
    },
    Number: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    convertTime: function (time) {
        var m = moment_1.default.duration(time, 'milliseconds');
        var result = "".concat(m.hours() === 0 ? '' : "".concat(m.hours(), " ").concat(m.hours() === 1 ? "heure" : "heures", " ")).concat(m.minutes() === 0 ? '' : "".concat(m.minutes(), " ").concat(m.minutes() === 1 ? "minute" : "minutes", " ")).concat(m.seconds() === 0 ? "" : "".concat(m.seconds(), " ").concat(m.seconds() === 1 ? 'seconde' : 'secondes'));
        return result;
    },
    randomChar: function (Length) {
        var length;
        if (!Length || length == 0)
            length = 15;
        else
            length = Length;
        var res = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var value = "";
        for (var i = 0, n = res.length; i < length; ++i) {
            value += res.charAt(Math.floor(Math.random() * n));
        }
        return value;
    },
    isDiscordLink: function (str) {
        var discordInvite = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;
        return discordInvite.test(str);
    },
    isLink: function (str) {
        var reg = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
        return reg.test(str);
    },
    emoji: function (client, name, option) {
        var emojis = client.emojis.cache.find(function (x) { return x.name === name; });
        if (!emojis)
            return ":".concat(name, ":");
        if (option === "id") {
            return emojis.id;
        }
        if (option === "name") {
            return emojis.name;
        }
        if (emojis) {
            return name
                .split(new RegExp(name, "g"))
                .join(emojis.toString())
                .split(" ")
                .join("_");
        }
    },
    getJoinPosition: function (user, guild) {
        if (!guild.members.cache.has(user.id))
            return 'Inconnu';
        var arr = [];
        guild.members.cache.forEach(function (member) {
            arr.push(member);
        });
        arr.sort(function (a, b) { return a.joinedAt - b.joinedAt; });
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].id == user.id)
                return i + 1;
        }
    },
    isBuy: function (client, userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, client.db.oneOrNone("SELECT 1 FROM clarity_".concat((_a = client.user) === null || _a === void 0 ? void 0 : _a.id, "_buyers WHERE user_id = $1"), [userId])];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    },
    formatTimestamp: function (timestamp) {
        return __awaiter(this, void 0, void 0, function () {
            var date, options;
            return __generator(this, function (_a) {
                date = new Date(timestamp);
                options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
                return [2 /*return*/, date.toLocaleDateString('fr-FR', options)];
            });
        });
    },
    json2array: function (json) {
        try {
            var obj = json ? JSON.parse(json) : {};
            return obj;
        }
        catch (err) {
            return json;
        }
    },
    capitalizeFirstLetter: function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
};
