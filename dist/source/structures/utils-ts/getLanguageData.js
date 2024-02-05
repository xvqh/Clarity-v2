import yaml from 'js-yaml';
import fs from 'fs';
;
let LangsData = {};
async function getLanguageData(client, guildId) {
    let lang = await client.data2.get(`${guildId}_guildlang`) || 'fr-FR';
    let dat = LangsData[lang];
    if (!dat) {
        let fileContent = fs.readFileSync(`${process.cwd()}/source/lang/${lang}.yml`, 'utf-8');
        LangsData[lang] = yaml.load(fileContent);
        dat = LangsData[lang];
    }
    ;
    return dat;
}
;
export default { getLanguageData };
