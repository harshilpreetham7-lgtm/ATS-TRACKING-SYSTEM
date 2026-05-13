const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resume: {
    filename: String,
    originalName: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  status: {
    type: String,
    enum: ['applied', 'reviewing', 'shortlisted', 'interviewed', 'offered', 'rejected'],
    default: 'applied'
  },
  aiAnalysis: {
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    summary: String,
    strengths: [String],
    weaknesses: [String],
    recommendations: [String]
  },
  notes: [{
    content: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);