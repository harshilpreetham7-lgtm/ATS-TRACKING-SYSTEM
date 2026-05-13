const express = require('express');
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const cache = require('../utils/cache');

const router = express.Router();

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const cached = await cache.get('jobs:list');
    if (cached) {
      return res.json(cached);
    }

    const jobs = await Job.find().populate('postedBy', 'name company').sort({ createdAt: -1 });
    await cache.set('jobs:list', jobs, 90);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name company');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create job (recruiters only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const job = new Job({
      ...req.body,
      postedBy: req.user.userId
    });

    await job.save();
    await job.populate('postedBy', 'name company');
    await cache.del('jobs:list');
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update job (recruiters only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(job, req.body);
    await job.save();
    await job.populate('postedBy', 'name company');
    await cache.del('jobs:list');
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete job (recruiters only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await job.remove();
    await cache.del('jobs:list');
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;