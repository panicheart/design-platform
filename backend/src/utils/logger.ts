import winston from 'winston';
import path from 'path';

const logDir = 'logs';
const { combine, timestamp, printf, colorize } = winston.format;

// Custom log format
const logFormat = printf((info) => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

// Create logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat
  ),
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat
      ),
    }),
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
    // Write all logs with level 'info' and below to combined.log
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
    }),
  ],
});

// Create a stream object for Morgan
export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export default logger; 