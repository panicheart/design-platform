"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const logDir = 'logs';
const { combine, timestamp, printf, colorize } = winston_1.default.format;
// Custom log format
const logFormat = printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});
// Create logger instance
const logger = winston_1.default.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }), logFormat),
    transports: [
        // Write all logs to console
        new winston_1.default.transports.Console({
            format: combine(colorize(), timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }), logFormat),
        }),
        // Write all logs with level 'error' and below to error.log
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, 'error.log'),
            level: 'error',
        }),
        // Write all logs with level 'info' and below to combined.log
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, 'combined.log'),
        }),
    ],
});
// Create a stream object for Morgan
exports.stream = {
    write: (message) => {
        logger.info(message.trim());
    },
};
exports.default = logger;
