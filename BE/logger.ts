import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    transports: [
        new winstonDaily({
            level: 'debug',
            datePattern: 'YYYY-MM-DD',
            dirname: `./logs`,
            filename: `%DATE%.log`,
            maxFiles: 3,
            zippedArchive: false
        })
    ]
});

export { logger }