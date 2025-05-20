import express from 'express';
import Resource from '../models/Resource';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get all resources
router.get('/', async (req, res) => {
  try {
    const { type, status, visibility } = req.query;
    const query: any = {};

    if (type) query.type = type;
    if (status) query.status = status;
    if (visibility) query.visibility = visibility;

    const resources = await Resource.find(query)
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email');

    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resources', error });
  }
});

// Get single resource
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email');

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resource', error });
  }
});

// Create new resource
router.post('/', auth, async (req, res) => {
  try {
    const resource = new Resource({
      ...req.body,
      createdBy: req.user._id,
      updatedBy: req.user._id
    });

    await resource.save();
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Error creating resource', error });
  }
});

// Update resource
router.put('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Update fields
    Object.assign(resource, {
      ...req.body,
      updatedBy: req.user._id
    });

    await resource.save();
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Error updating resource', error });
  }
});

// Delete resource
router.delete('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    await Resource.deleteOne({ _id: req.params.id });
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting resource', error });
  }
});

export default router; 