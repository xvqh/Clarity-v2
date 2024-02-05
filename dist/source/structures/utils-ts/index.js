import moment from 'moment';
export default {
    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    dateToEpoch(date) {
        return date.getTime() / 1000;
    },
    Number(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    convertTime(time) {
        let m = moment.duration(time, 'milliseconds');
        let result = `${m.hours() === 0 ? '' : `${m.hours()} ${m.hours() === 1 ? "heure" : "heures"} `}${m.minutes() === 0 ? '' : `${m.minutes()} ${m.minutes() === 1 ? "minute" : "minutes"} `}${m.seconds() === 0 ? "" : `${m.seconds()} ${m.seconds() === 1 ? 'seconde' : 'secondes'}`}`;
        return result;
    },
    randomChar(Length) {
        let length;
        if (!Length || length == 0)
            length = 15;
        else
            length = Length;
        let res = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let value = "";
        for (let i = 0, n = res.length; i < length; ++i) {
            value += res.charAt(Math.floor(Math.random() * n));
        }
        return value;
    },
    isDiscordLink(str) {
        const discordInvite = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;
        return discordInvite.test(str);
    },
    isLink(str) {
        const reg = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
        return reg.test(str);
    },
    emoji(client, name, option) {
        let emojis = client.emojis.cache.find((x) => x.name === name);
        if (!emojis)
            return `:${name}:`;
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
    getJoinPosition(user, guild) {
        if (!guild.members.cache.has(user.id))
            return 'Inconnu';
        let arr = [];
        guild.members.cache.forEach(member => {
            arr.push(member);
        });
        arr.sort((a, b) => a.joinedAt - b.joinedAt);
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == user.id)
                return i + 1;
        }
    },
    async isBuy(client, userId) {
        return await client.db.oneOrNone(`SELECT 1 FROM clarity_${client.user?.id}_buyers WHERE user_id = $1`, [userId]);
    },
    async formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return date.toLocaleDateString('fr-FR', options);
    },
    json2array(json) {
        try {
            var obj = json ? JSON.parse(json) : {};
            return obj;
        }
        catch (err) {
            return json;
        }
    },
    capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
};
