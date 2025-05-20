"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    // Log unexpected errors
    console.error('ERROR 💥', err);
    // Send generic error response
    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong',
    });
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
};
exports.notFoundHandler = notFoundHandler;
