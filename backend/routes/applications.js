const express = require('express');
const Application = require('../models/Application');
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const { analyzeResume } = require('../utils/ai');
const cache = require('../utils/cache');

const router = express.Router();

// Get applications for a job (recruiters only)
router.get('/job/:jobId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const cacheKey = `applications:job:${req.params.jobId}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email profile')
      .populate('job', 'title company')
      .sort({ createdAt: -1 });

    await cache.set(cacheKey, applications, 90);
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's applications (candidates only)
router.get('/my', auth, async (req, res) => {
  try {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const cacheKey = `applications:user:${req.user.userId}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const applications = await Application.find({ applicant: req.user.userId })
      .populate('job', 'title company location type')
      .sort({ createdAt: -1 });

    await cache.set(cacheKey, applications, 90);
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply for job
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { jobId, resume } = req.body;

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.userId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }

    const application = new Application({
      job: jobId,
      applicant: req.user.userId,
      resume
    });

    // AI analysis
    try {
      const analysis = await analyzeResume(resume, jobId);
      application.aiAnalysis = analysis;
    } catch (aiError) {
      console.error('AI analysis failed:', aiError);
      // Continue without AI analysis
    }

    await application.save();
    await application.populate('applicant', 'name email');
    await application.populate('job', 'title company');

    // Add to job's applications
    await Job.findByIdAndUpdate(jobId, {
      $push: { applications: application._id }
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`job:${jobId}`).emit('newApplication', application);
      io.to(`user:${req.user.userId}`).emit('applicationSubmitted', application);
    }

    await cache.del(`applications:job:${jobId}`);
    await cache.del(`applications:user:${req.user.userId}`);

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application status (recruiters only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`job:${application.job.toString()}`).emit('applicationUpdated', application);
      io.to(`user:${application.applicant.toString()}`).emit('applicationStatusChanged', application);
    }

    await cache.del(`applications:job:${application.job.toString()}`);
    await cache.del(`applications:user:${application.applicant.toString()}`);

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add note to application (recruiters only)
router.post('/:id/notes', auth, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { content } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.notes.push({
      content,
      addedBy: req.user.userId
    });

    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;