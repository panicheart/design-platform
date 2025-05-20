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
const Resource_1 = __importDefault(require("../models/Resource"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get all resources
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, status, visibility } = req.query;
        const query = {};
        if (type)
            query.type = type;
        if (status)
            query.status = status;
        if (visibility)
            query.visibility = visibility;
        const resources = yield Resource_1.default.find(query)
            .populate('createdBy', 'username email')
            .populate('updatedBy', 'username email');
        res.json(resources);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching resources', error });
    }
}));
// Get single resource
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resource = yield Resource_1.default.findById(req.params.id)
            .populate('createdBy', 'username email')
            .populate('updatedBy', 'username email');
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        res.json(resource);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching resource', error });
    }
}));
// Create new resource
router.post('/', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resource = new Resource_1.default(Object.assign(Object.assign({}, req.body), { createdBy: req.user._id, updatedBy: req.user._id }));
        yield resource.save();
        res.status(201).json(resource);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating resource', error });
    }
}));
// Update resource
router.put('/:id', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resource = yield Resource_1.default.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        // Update fields
        Object.assign(resource, Object.assign(Object.assign({}, req.body), { updatedBy: req.user._id }));
        yield resource.save();
        res.json(resource);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating resource', error });
    }
}));
// Delete resource
router.delete('/:id', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resource = yield Resource_1.default.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        yield Resource_1.default.deleteOne({ _id: req.params.id });
        res.json({ message: 'Resource deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting resource', error });
    }
}));
exports.default = router;
