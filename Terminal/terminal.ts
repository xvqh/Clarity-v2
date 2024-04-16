import logger from "../source/structures/client-ts/logger";
import os from "node:os";
import readline from 'readline';
import fs from 'node:fs';
import path from "path";
import { Client } from "discord.js"
import  wait from "../Functions/wait"
import getIP from "../Functions/getIp"
function niceBytes(a: Number) { let b = 0, c = parseInt((a as unknown as string), 10) || 0; for (; 1024 <= c && ++b;)c /= 1024; return c.toFixed(10 > c && 0 < b ? 1 : 0) + " " + ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][b] }


export default async (client: Client)=> {
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let now = new Date();
    let dateStr = `${now.toLocaleString('default', { day: '2-digit' })} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear().toString().substr(-2)} ${now.toLocaleTimeString('en-US', { hour12: false })} 2023`.toString();

    let ip = getIP({ useIPv6: false });

    logger.info(`* Clarity Terminal is loading on : ${ip}`);
    logger.info(`* Date : ${dateStr}`);

    let table = client.terminal.table("Terminal");
    let Loaded = await table.get(`Last_Login`) || "None";
    let Loaded2 = "127.0.0.1";
    let filePath = path.join(__dirname, "Terminal", "terminal" , "history", ".terminal_history");
    let createFiles = fs.createWriteStream(filePath, { flags: 'a' });
    await table.set(`Last_Login`, dateStr)
    logger.legacy(`
    * Welcome to the Clarity Terminal
    
    * Type "help" to get started
    
    * Type "clear" to clear the terminal
    
    Date : ${dateStr},
    
    System Information : 
    
    * OS : ${os.type()} ${os.release()} ${os.arch()}
    
    * Memory usage:                  ${niceBytes(os.freemem())}/${niceBytes(os.totalmem())}
    * IPv4 address for eth0:         ${await getIP({ useIPv6: false })}
    * IPv6 address for eth0:         ${await getIP({ useIPv6: true })}
    * Node.js :                      ${process.version}
    * Discord.js :                   v${client.version}
    * Clarity :                      v${client.config.version}
    Last Login : ${Loaded} from ${Loaded2} 
    `);
    rl.setPrompt('contact@clarity-corp.com')
    rl.prompt();
    rl.on('line', async (line: string) => {
        try {
            let [commandName, ...args] = line.trim().split(' ');
            let commandPath = `${process.cwd()}/dist/Terminal/Commands/${commandName}.js`;

            if (fs.existsSync(commandPath)) {
                let command = await import(commandPath);
                command.default(client, args.join(' '));

                var data = fs.readFileSync(filePath, 'utf-8');
                let lineNumber = data.toString().split('\n').length;
                if (commandName) { createFiles.write(`   ${lineNumber}  ${line}\r\n`); };
            } else {
                if (commandName) logger.warn(`Command not found: ${commandName}`);
            }
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