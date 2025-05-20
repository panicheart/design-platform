"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Task_1 = __importDefault(require("../models/Task"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get all tasks
router.get('/', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, status, assignedTo } = req.query;
        const query = {};
        if (type)
            query.type = type;
        if (status)
            query.status = status;
        if (assignedTo)
            query.assignedTo = assignedTo;
        const tasks = yield Task_1.default.find(query)
            .populate('assignedTo', 'username email')
            .populate('createdBy', 'username email');
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
}));
// Get single task
router.get('/:id', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield Task_1.default.findById(req.params.id)
            .populate('assignedTo', 'username email')
            .populate('createdBy', 'username email');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching task', error });
    }
}));
// Create new task
router.post('/', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = new Task_1.default(Object.assign(Object.assign({}, req.body), { createdBy: req.user._id }));
        yield task.save();
        res.status(201).json(task);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating task', error });
    }
}));
// Update task
router.put('/:id', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield Task_1.default.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        // Update fields
        Object.assign(task, req.body);
        yield task.save();
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating task', error });
    }
}));
// Delete task
router.delete('/:id', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield Task_1.default.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        yield Task_1.default.deleteOne({ _id: req.params.id });
        res.json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting task', error });
    }
}));
// Add comment to task
router.post('/:id/comments', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield Task_1.default.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        task.comments.push({
            content: req.body.content,
            author: req.user._id,
            createdAt: new Date(),
        });
        yield task.save();
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding comment', error });
    }
}));
// Update task progress
router.patch('/:id/progress', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield Task_1.default.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        task.progress = req.body.progress;
        yield task.save();
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating progress', error });
    }
}));
exports.default = router;
