import "colors";
import { Logger } from "../../../Interfaces/logger";
function getLocalCurrentTime(): string {
    return new Date().toLocaleTimeString();
}

let logger: Logger = {
    log: (message: string) => {
        console.log(`[${getLocalCurrentTime()}] ${message}`.green);
    },
    error: (message: string) => {
        console.error(`[${getLocalCurrentTime()}] ${message}`.red);
    },
    warn: (message: string) => {
        console.warn(`[${getLocalCurrentTime()}] ${message}`.yellow);
    },
    info: (message: string) => {
        console.info(`[${getLocalCurrentTime()}] ${message}`.cyan);
    },
    debug: (message: string) => {
        console.debug(`[${getLocalCurrentTime()}] ${message}`.blue);
    },
    verbose: (message: string) => {
        console.log(`[${getLocalCurrentTime()}] ${message}`.magenta);
    },
    silly: (message: string) => {
        console.log(`[${getLocalCurrentTime()}] ${message}`.white);
    },
    legacy: (message: string) => {
        console.log(`[${getLocalCurrentTime()}] ${message}`);
    }
}

export default logger;