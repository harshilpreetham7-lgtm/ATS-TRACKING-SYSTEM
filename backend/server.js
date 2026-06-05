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

let applicationId = 1;
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
  // Return mock applications
  const mockApplications = [
    {
      _id: 'app-1',
      applicant: { name: 'John Doe', email: 'john@example.com', score: 85 },
      job: mockJobs[0],
      status: 'applied',
      createdAt: new Date(),
    },
    {
      _id: 'app-2',
      applicant: { name: 'Jane Smith', email: 'jane@example.com', score: 92 },
      job: mockJobs[0],
      status: 'shortlisted',
      createdAt: new Date(),
    },
    {
      _id: 'app-3',
      applicant: { name: 'Bob Wilson', email: 'bob@example.com', score: 78 },
      job: mockJobs[1],
      status: 'reviewing',
      createdAt: new Date(),
    },
  ];
  res.json(mockApplications);
});

app.put('/api/applications/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  res.json({
    _id: id,
    status,
    updatedAt: new Date(),
  });
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
