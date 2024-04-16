import winston from "winston";

module.exports = class Logger {
    constructor(logF) {
        this.logger = winston.createLogger({
            transports: [new winston.transports.File({ filename: logF })]
        })
    }
    log(msg) {
        let date = new Date();
        this.logger.log({
            level: 'info',
            message: `${date.getHours()}:${date.getMinutes
                } - ${date.getDate()}:${date.getMonth()}:${date.getFullYear()} | Info: ${msg}`
        });
        console.log(`${date.getHours()}:${date.getMinutes
            } - ${date.getDate()}:${date.getMonth()}:${date.getFullYear()} | Info: ${msg}`
        );
    }
}