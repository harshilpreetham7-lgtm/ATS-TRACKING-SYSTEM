import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 5004;
const JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production';

app.use(cors());
app.use(express.json());

// Mock data
const users = new Map();
const applications = new Map();
const jobs = new Map();

let jobId = 1;

// Seed some mock data
const mockJobs = [
  {
    _id: String(jobId++),
    title: 'Senior React Developer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description: 'Looking for an experienced React developer with 5+ years of experience.',
    createdBy: 'recruiter1',
  },
  {
    _id: String(jobId++),
    title: 'Product Manager',
    company: 'Startup Inc',
    location: 'Remote',
    type: 'Full-time',
    description: 'Join our team as a Product Manager to lead product strategy.',
    createdBy: 'recruiter1',
  },
];

mockJobs.forEach(job => jobs.set(job._id, job));

const createWorkflowState = () => ({
  candidateDetails: {
    phone: '',
    experienceYears: '',
    noticePeriod: '',
    currentLocation: '',
    expectedCtc: '',
    portfolioUrl: '',
    whyThisRole: '',
  },
  review: {
    summary: '',
    shortlistedReason: '',
    rejectionReason: '',
  },
  interview: {
    formRequested: false,
    formLink: '',
    examLink: '',
    interviewDate: '',
    interviewer: '',
    interviewNotes: '',
    examStatus: 'pending',
    score: null,
  },
  offer: {
    offerSent: false,
    offerSentAt: null,
    offerLetterLink: '',
    message: '',
  },
  communication: {
    lastEmailTo: '',
    lastEmailType: '',
    lastEmailAt: null,
  },
});

const nowIso = () => new Date().toISOString();

const mockApplications = [
  {
    _id: 'app-1',
    applicant: { name: 'John Doe', email: 'john@example.com', score: 85 },
    job: mockJobs[0],
    status: 'applied',
    workflow: {
      ...createWorkflowState(),
      candidateDetails: {
        phone: '+1-415-555-0111',
        experienceYears: '4',
        noticePeriod: '30 days',
        currentLocation: 'San Francisco, CA',
        expectedCtc: '$120k',
        portfolioUrl: 'https://portfolio.example/john',
        whyThisRole: 'Building scalable React products for global teams.',
      },
    },
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    _id: 'app-2',
    applicant: { name: 'Jane Smith', email: 'jane@example.com', score: 92 },
    job: mockJobs[0],
    status: 'shortlisted',
    workflow: {
      ...createWorkflowState(),
      review: {
        summary: 'Strong React architecture and testing depth.',
        shortlistedReason: 'Top score on role-fit and system design communication.',
        rejectionReason: '',
      },
      interview: {
        formRequested: true,
        formLink: 'https://forms.example.com/jane-profile',
        examLink: 'https://exam.example.com/react-advanced',
        interviewDate: '2026-05-28T11:00',
        interviewer: 'Priya Sharma',
        interviewNotes: 'Panel aligned on frontend depth check.',
        examStatus: 'pending',
        score: null,
      },
    },
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    _id: 'app-3',
    applicant: { name: 'Bob Wilson', email: 'bob@example.com', score: 78 },
    job: mockJobs[1],
    status: 'reviewing',
    workflow: {
      ...createWorkflowState(),
      review: {
        summary: 'Product thinking is solid; domain depth under evaluation.',
        shortlistedReason: '',
        rejectionReason: '',
      },
    },
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

mockApplications.forEach((appItem) => applications.set(appItem._id, appItem));

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  // Mock validation
  const user = {
    _id: 'user-' + Date.now(),
    name: email.split('@')[0],
    email,
    role: 'recruiter',
    company: 'ATS Team',
  };

  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
  users.set(user._id, user);

  res.json({
    success: true,
    token,
    user,
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, company } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  const user = {
    _id: 'user-' + Date.now(),
    name: name || email.split('@')[0],
    email,
    role: role || 'candidate',
    company: company || 'ATS Team',
  };

  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
  users.set(user._id, user);

  res.json({
    success: true,
    token,
    user,
  });
});

// Jobs endpoints
app.get('/api/jobs', (req, res) => {
  res.json(Array.from(jobs.values()));
});

app.post('/api/jobs', (req, res) => {
  const { title, company, location, type, description } = req.body;
  const job = {
    _id: String(jobId++),
    title,
    company,
    location,
    type,
    description,
    createdBy: req.headers.authorization?.split(' ')[1] || 'recruiter1',
    createdAt: new Date(),
  };
  jobs.set(job._id, job);
  res.json(job);
});

// Applications endpoints
app.get('/api/applications/my', (req, res) => {
  res.json(Array.from(applications.values()));
});

app.put('/api/applications/:id/status', (req, res) => {
  const { id } = req.params;
  const {
    status,
    shortlistedReason,
    rejectionReason,
    reviewSummary,
    interviewNotes,
    interviewDate,
    interviewer,
    examStatus,
    examLink,
    formLink,
    offerLetterLink,
    offerMessage,
  } = req.body || {};

  const record = applications.get(id);
  if (!record) {
    return res.status(404).json({ message: 'Application not found' });
  }

  const allowedStatuses = new Set(['applied', 'reviewing', 'shortlisted', 'interviewed', 'offered', 'rejected']);
  if (status && !allowedStatuses.has(status)) {
    return res.status(400).json({ message: 'Invalid status transition' });
  }

  const next = {
    ...record,
    status: status || record.status,
    workflow: {
      ...record.workflow,
      review: {
        ...record.workflow.review,
        summary: reviewSummary ?? record.workflow.review.summary,
        shortlistedReason: shortlistedReason ?? record.workflow.review.shortlistedReason,
        rejectionReason: rejectionReason ?? record.workflow.review.rejectionReason,
      },
      interview: {
        ...record.workflow.interview,
        interviewNotes: interviewNotes ?? record.workflow.interview.interviewNotes,
        interviewDate: interviewDate ?? record.workflow.interview.interviewDate,
        interviewer: interviewer ?? record.workflow.interview.interviewer,
        examStatus: examStatus ?? record.workflow.interview.examStatus,
        examLink: examLink ?? record.workflow.interview.examLink,
        formLink: formLink ?? record.workflow.interview.formLink,
      },
      offer: {
        ...record.workflow.offer,
        offerLetterLink: offerLetterLink ?? record.workflow.offer.offerLetterLink,
        message: offerMessage ?? record.workflow.offer.message,
      },
    },
    updatedAt: nowIso(),
  };

  if (status === 'offered') {
    next.workflow.offer.offerSent = true;
    next.workflow.offer.offerSentAt = nowIso();
    next.workflow.communication.lastEmailType = 'offer-letter';
    next.workflow.communication.lastEmailTo = next.applicant.email;
    next.workflow.communication.lastEmailAt = nowIso();
  }

  if (status === 'rejected') {
    next.workflow.communication.lastEmailType = 'rejection-update';
    next.workflow.communication.lastEmailTo = next.applicant.email;
    next.workflow.communication.lastEmailAt = nowIso();
  }

  applications.set(id, next);
  res.json(next);
});

app.put('/api/applications/:id/details', (req, res) => {
  const { id } = req.params;
  const { details } = req.body || {};
  const record = applications.get(id);

  if (!record) {
    return res.status(404).json({ message: 'Application not found' });
  }

  const next = {
    ...record,
    workflow: {
      ...record.workflow,
      candidateDetails: {
        ...record.workflow.candidateDetails,
        ...(details || {}),
      },
    },
    updatedAt: nowIso(),
  };

  applications.set(id, next);
  res.json(next);
});

app.put('/api/applications/:id/interview-request', (req, res) => {
  const { id } = req.params;
  const { formLink, examLink, interviewer, interviewDate, interviewNotes } = req.body || {};
  const record = applications.get(id);

  if (!record) {
    return res.status(404).json({ message: 'Application not found' });
  }

  const next = {
    ...record,
    status: 'interviewed',
    workflow: {
      ...record.workflow,
      interview: {
        ...record.workflow.interview,
        formRequested: true,
        formLink: formLink || record.workflow.interview.formLink,
        examLink: examLink || record.workflow.interview.examLink,
        interviewer: interviewer || record.workflow.interview.interviewer,
        interviewDate: interviewDate || record.workflow.interview.interviewDate,
        interviewNotes: interviewNotes || record.workflow.interview.interviewNotes,
      },
      communication: {
        ...record.workflow.communication,
        lastEmailTo: record.applicant.email,
        lastEmailType: 'interview-request',
        lastEmailAt: nowIso(),
      },
    },
    updatedAt: nowIso(),
  };

  applications.set(id, next);
  res.json(next);
});

app.put('/api/applications/:id/interview-result', (req, res) => {
  const { id } = req.params;
  const { passed, score, feedback } = req.body || {};
  const record = applications.get(id);

  if (!record) {
    return res.status(404).json({ message: 'Application not found' });
  }

  const nextStatus = passed ? 'offered' : 'rejected';
  const next = {
    ...record,
    status: nextStatus,
    workflow: {
      ...record.workflow,
      interview: {
        ...record.workflow.interview,
        examStatus: passed ? 'passed' : 'failed',
        score: typeof score === 'number' ? score : record.workflow.interview.score,
        interviewNotes: feedback || record.workflow.interview.interviewNotes,
      },
      review: {
        ...record.workflow.review,
        rejectionReason: passed ? record.workflow.review.rejectionReason : (feedback || 'Did not clear interview exam.'),
      },
      offer: {
        ...record.workflow.offer,
        offerSent: Boolean(passed),
        offerSentAt: passed ? nowIso() : null,
      },
      communication: {
        ...record.workflow.communication,
        lastEmailTo: record.applicant.email,
        lastEmailType: passed ? 'offer-letter' : 'rejection-update',
        lastEmailAt: nowIso(),
      },
    },
    updatedAt: nowIso(),
  };

  applications.set(id, next);
  res.json(next);
});

// Generate a short-lived token and return a frontend URL for form/exam
app.post('/api/applications/:id/generate-link', (req, res) => {
  const { id } = req.params;
  const { type, email } = req.body || {};
  const record = applications.get(id);
  if (!record) return res.status(404).json({ message: 'Application not found' });
  if (!['form', 'exam'].includes(type)) return res.status(400).json({ message: 'Invalid link type' });

  // create token with app id and type and short expiry (6 hours)
  const token = jwt.sign({ appId: id, type }, JWT_SECRET, { expiresIn: '6h' });

  // save token on the application workflow for quick lookup/debug
  const next = { ...record, workflow: { ...record.workflow, interview: { ...record.workflow.interview, token } }, updatedAt: nowIso() };
  applications.set(id, next);

  const origin = req.headers.origin || `http://localhost:5173`;
  const page = type === 'form' ? '/sample_candidate_form.html' : '/sample_exam.html';
  const url = `${origin}${page}?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email || record.applicant?.email || '')}&applicationId=${encodeURIComponent(id)}`;

  res.json({ token, url });
});

// Webhook/callback endpoint used by exam provider to post results
app.post('/api/exam/callback', (req, res) => {
  const { token, passed, score, feedback } = req.body || {};
  if (!token) return res.status(400).json({ message: 'Token required' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const { appId } = payload;
    const record = applications.get(appId);
    if (!record) return res.status(404).json({ message: 'Application not found' });

    // reuse interview-result logic: passed -> offered, failed -> rejected
    const nextStatus = passed ? 'offered' : 'rejected';
    const next = {
      ...record,
      status: nextStatus,
      workflow: {
        ...record.workflow,
        interview: {
          ...record.workflow.interview,
          examStatus: passed ? 'passed' : 'failed',
          score: typeof score === 'number' ? score : record.workflow.interview.score,
          interviewNotes: feedback || record.workflow.interview.interviewNotes,
        },
        review: {
          ...record.workflow.review,
          rejectionReason: passed ? record.workflow.review.rejectionReason : (feedback || 'Exam failed'),
        },
        offer: {
          ...record.workflow.offer,
          offerSent: Boolean(passed),
          offerSentAt: passed ? nowIso() : null,
        },
        communication: {
          ...record.workflow.communication,
          lastEmailTo: record.applicant.email,
          lastEmailType: passed ? 'offer-letter' : 'rejection-update',
          lastEmailAt: nowIso(),
        },
      },
      updatedAt: nowIso(),
    };

    applications.set(appId, next);
    return res.json(next);
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token', error: err.message });
  }
});

app.put('/api/applications/order', (req, res) => {
  const { order } = req.body || {};

  if (!Array.isArray(order)) {
    return res.status(400).json({ message: 'Order must be an array of application IDs' });
  }

  const orderedList = [];
  const seen = new Set();

  order.forEach((id) => {
    const item = applications.get(id);
    if (item) {
      orderedList.push(item);
      seen.add(id);
    }
  });

  Array.from(applications.values()).forEach((item) => {
    if (!seen.has(item._id)) {
      orderedList.push(item);
    }
  });

  applications.clear();
  orderedList.forEach((item) => applications.set(item._id, item));
  res.json(orderedList);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mock ATS Backend Running' });
});

app.listen(PORT, () => {
  console.log(`✅ Mock ATS Backend running on http://localhost:${PORT}`);
  console.log(`📊 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🔌 Ready to accept frontend connections`);
});
