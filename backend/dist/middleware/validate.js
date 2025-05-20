"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.validateTask = exports.validateResource = void 0;
const error_1 = require("./error");
const validateResource = (req, res, next) => {
    const { type, title, description, content } = req.body;
    if (!type || !title || !description || !content) {
        return next(new error_1.AppError('Please provide all required fields', 400));
    }
    const validTypes = ['human', 'time', 'material', 'component', 'product', 'knowledge'];
    if (!validTypes.includes(type)) {
        return next(new error_1.AppError('Invalid resource type', 400));
    }
    next();
};
exports.validateResource = validateResource;
const validateTask = (req, res, next) => {
    const { title, description, type, assignedTo, startDate, dueDate, } = req.body;
    if (!title || !description || !type || !assignedTo || !startDate || !dueDate) {
        return next(new error_1.AppError('Please provide all required fields', 400));
    }
    const validTypes = [
        'new_product',
        'model_development',
        'circuit_verification',
        'issue_handling',
        'testing',
        'technical_cooperation',
    ];
    if (!validTypes.includes(type)) {
        return next(new error_1.AppError('Invalid task type', 400));
    }
    if (new Date(startDate) > new Date(dueDate)) {
        return next(new error_1.AppError('Start date must be before due date', 400));
    }
    next();
};
exports.validateTask = validateTask;
const validateUser = (req, res, next) => {
    const { username, email, password, department, position } = req.body;
    if (!username || !email || !password || !department || !position) {
        return next(new error_1.AppError('Please provide all required fields', 400));
    }
    if (password.length < 6) {
        return next(new error_1.AppError('Password must be at least 6 characters long', 400));
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return next(new error_1.AppError('Please provide a valid email address', 400));
    }
    next();
};
exports.validateUser = validateUser;
