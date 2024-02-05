import yaml from 'js-yaml';
import Clarity from '../client';
import fs from 'fs';

let LangsData = {};

/**
 * @param {Clarity} client
 * @param {string} guildId 
 */
async function getLanguageData(client, guildId) {
    let lang = client.data2.has(`${guildId}_guildlang`) || 'fr-FR';

    let dat = LangsData[lang];

    if (!dat) {
        let fileContent = fs.readFileSync(`${process.cwd()}/source/lang/${lang}.yml`,
            'utf-8'
        );

        LangsData[lang] = yaml.load(fileContent);
        dat = LangsData[lang]
    };

    return dat;
};

export default { getLanguageData };