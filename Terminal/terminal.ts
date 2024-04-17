import { createInterface } from 'readline';
import { createWriteStream, existsSync, readFileSync } from 'fs';
import os from 'os';
import path from 'path';
import { Client } from 'discord.js';
import logger from '../source/structures/client-ts/logger';
import wait from '../Functions/wait';
import getIP from '../Functions/getIp';

// Fonction pour formater les octets de manière lisible
const niceBytes = (bytes: number): string => {
    const suffixes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let index = 0;
    while (bytes >= 1024 && index < suffixes.length - 1) {
        bytes /= 1024;
        index++;
    }
    return `${bytes.toFixed(index === 0 ? 0 : 1)} ${suffixes[index]}`;
};

// Fonction pour obtenir la date au format spécifié
const getDateStr = (): string => {
    const now = new Date();
    return `${now.toLocaleString('default', { day: '2-digit' })} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear().toString().substr(-2)} ${now.toLocaleTimeString('en-US', { hour12: false })} 2023`;
};

// Fonction pour initialiser l'interface readline
const initReadline = (): any => {
    return createInterface({
        input: process.stdin,
        output: process.stdout
    });
};

// Fonction pour récupérer la dernière connexion
const getLastLogin = async (client: Client): Promise<string> => {
    const table = client.terminal.table('Terminal');
    const lastLogin = await table.get('Last_Login');
    return lastLogin || 'None';
};

// Fonction pour mettre à jour la dernière connexion
const updateLastLogin = async (client: Client, dateStr: string): Promise<void> => {
    const table = client.terminal.table('Terminal');
    await table.set('Last_Login', dateStr);
};

// Fonction pour afficher les informations système
const displaySystemInfo = async (client: Client, filePath: string): Promise<void> => {
    const dateStr = getDateStr();
    const ip = getIP({ useIPv6: false });

    logger.info(`* Clarity Terminal is loading on: ${ip}`);
    logger.info(`* Date: ${dateStr}`);

    const lastLogin = await getLastLogin(client) || 'None';
    const loaded2 = '127.0.0.1';

    await updateLastLogin(client, dateStr);

    logger.legacy(`
    * Welcome to the Clarity Terminal
    
    * Type "help" to get started
    * Type "clear" to clear the terminal
    
    Date: ${dateStr}
    
    System Information: 
    
    * OS: ${os.type()} ${os.release()} ${os.arch()}
    * Memory usage: ${niceBytes(os.freemem())} / ${niceBytes(os.totalmem())}
    * IPv4 address for eth0: ${await getIP({ useIPv6: false })}
    * IPv6 address for eth0: ${await getIP({ useIPv6: true })}
    * Node.js: ${process.version}
    * Discord.js: v${client.version}
    * Clarity: v${client.config.version}
    Last Login: ${lastLogin} from ${loaded2} 
    `);
};
// Fonction pour exécuter une commande
const executeCommand = async (commandPath: string, client: Client, args: string, filePath: string): Promise<void> => {
    if (existsSync(commandPath)) {
        const command = await import(commandPath);
        command.default(client, args);

        const data = readFileSync(filePath, 'utf-8');
        const lineNumber = data.toString().split('\n').length;
        if (commandPath) createFiles.write(`   ${lineNumber}  ${args}\r\n`);
    } else {
        if (commandPath) logger.warn(`Command not found: ${commandPath}`);
    }
};

export default async function startTerminal(client: Client) {
    const rl = initReadline();
    const filePath = path.join(__dirname, 'Terminal', 'terminal', 'history', '.terminal_history');
    const createFiles = createWriteStream(filePath, { flags: 'a' });

    await displaySystemInfo(client, filePath);

    rl.setPrompt('contact@clarity-corp.com');
    rl.prompt();

    rl.on('line', async (line: string) => {
        try {
            const [commandName, ...args] = line.trim().split(' ');
            const commandPath = `${process.cwd()}/dist/Terminal/Commands/${commandName}.js`;
            await executeCommand(commandPath, client, args.join(' '), filePath);
        } catch (error: any) {
            logger.error(`Error: ${error.message}`);
        } finally {
            rl.prompt();
        }
    });
}

/*
Clarity From https://github.com/Clarity-Corp/Clarity-v2

Copyright (c) 2024 Clarity Corp.

The developer is :
 - Tsubasa
 */

/*
Remix of iHrz bash from https://github.com/ihrz/ihrz
*/
