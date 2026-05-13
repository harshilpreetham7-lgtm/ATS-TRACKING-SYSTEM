const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const { client: redisClient, connect: connectRedis, usingRedis } = require('./utils/cache');

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

// Middleware
const defaultFrontendOrigins = [
  'http://localhost:5179',
  'http://localhost:5183',
  'http://localhost:5184',
  'http://localhost:5185',
  'http://localhost:5186',
];
const envFrontendOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [];
const allowedOrigins = Array.from(new Set([...defaultFrontendOrigins, ...envFrontendOrigins]));

const isLocalhostOrigin = (origin) => {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
};

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || isLocalhostOrigin(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy does not allow access from the specified origin'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ats', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

connectRedis()
  .then(() => {
    console.log('Redis connect attempt finished');
    let pubClient, subClient;
    if (usingRedis) {
      pubClient = redisClient.duplicate();
      subClient = redisClient.duplicate();
    }
    const io = new Server(httpServer, {
      cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      },
      allowEIO3: true,
    });

    if (usingRedis) {
      io.adapter(createAdapter(pubClient, subClient));
      console.log('Socket.IO using Redis adapter');
    } else {
      console.log('Socket.IO running without Redis adapter');
    }

    io.use((socket, next) => {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) {
        return next(new Error('Authentication token required'));
      }
      try {
        const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'your-secret-key');
        socket.user = decoded;
        return next();
      } catch (err) {
        return next(new Error('Invalid authentication token'));
      }
    });

    io.on('connection', async (socket) => {
      const userId = socket.user.userId;
      socket.join(`user:${userId}`);
      // Redis not available, skip hset

      socket.on('joinJobRoom', (jobId) => {
        if (jobId) {
          socket.join(`job:${jobId}`);
        }
      });

      socket.on('moveApplication', async ({ applicationId, status }) => {
        const Application = require('./models/Application');
        try {
          const application = await Application.findById(applicationId);
          if (!application) return;
          application.status = status;
          await application.save();
          io.to(`job:${application.job.toString()}`).emit('applicationUpdated', application);
          io.to(`user:${application.applicant.toString()}`).emit('applicationStatusChanged', application);
        } catch (error) {
          console.error('Socket moveApplication error:', error);
        }
      });

      socket.on('disconnect', async () => {
        // Redis not available, skip hdel
      });
    });

    app.set('io', io);

    const listenAsync = (server, port) => {
      return new Promise((resolve, reject) => {
        const onError = (error) => {
          server.off('listening', onListening);
          reject(error);
        };

        const onListening = () => {
          server.off('error', onError);
          resolve(port);
        };

        server.once('error', onError);
        server.once('listening', onListening);
        server.listen(port);
      });
    };

    const startServer = async (port) => {
      try {
        const chosenPort = await listenAsync(httpServer, port);
        console.log(`Server listening on port ${chosenPort}`);
      } catch (error) {
        if (error.code === 'EADDRINUSE') {
          console.warn(`Port ${port} is already in use. Trying ${port + 1}...`);
          await startServer(port + 1);
        } else {
          console.error('Server error:', error);
          process.exit(1);
        }
      }
    };

    startServer(parseInt(process.env.PORT, 10) || 5000);
  })
  .catch((err) => {
    console.error('Redis connection failed, continuing without Redis:', err.message);
    // Don't exit, continue without Redis
    const io = new Server(httpServer, {
      cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      },
      allowEIO3: true,
    });

    console.log('Socket.IO running without Redis adapter');

    io.use((socket, next) => {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) {
        return next(new Error('Authentication token required'));
      }
      try {
        const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'your-secret-key');
        socket.user = decoded;
        return next();
      } catch (err) {
        return next(new Error('Invalid authentication token'));
      }
    });

    io.on('connection', async (socket) => {
      const userId = socket.user.userId;
      socket.join(`user:${userId}`);
      try {
        if (usingRedis && redisClient.isOpen) {
          await redisClient.hset('activeSockets', userId, socket.id);
        }
      } catch (error) {
        console.warn('Redis hset failed:', error.message);
      }

      socket.on('joinJobRoom', (jobId) => {
        if (jobId) {
          socket.join(`job:${jobId}`);
        }
      });

      socket.on('moveApplication', async ({ applicationId, status }) => {
        const Application = require('./models/Application');
        try {
          const application = await Application.findById(applicationId);
          if (!application) return;
          application.status = status;
          await application.save();
          io.to(`job:${application.job.toString()}`).emit('applicationUpdated', application);
          io.to(`user:${application.applicant.toString()}`).emit('applicationStatusChanged', application);
        } catch (error) {
          console.error('Socket moveApplication error:', error);
        }
      });

      socket.on('disconnect', async () => {
        if (usingRedis && redisClient.isOpen) {
          await redisClient.hdel('activeSockets', userId);
        }
      });
    });

    app.set('io', io);

    const listenAsync = (server, port) => {
      return new Promise((resolve, reject) => {
        const onError = (error) => {
          server.off('listening', onListening);
          reject(error);
        };

        const onListening = () => {
          server.off('error', onError);
          resolve(port);
        };

        server.once('error', onError);
        server.once('listening', onListening);
        server.listen(port);
      });
    };

    const startServer = async (port) => {
      try {
        const chosenPort = await listenAsync(httpServer, port);
        console.log(`Server listening on port ${chosenPort}`);
      } catch (error) {
        if (error.code === 'EADDRINUSE') {
          console.warn(`Port ${port} is already in use. Trying ${port + 1}...`);
          await startServer(port + 1);
        } else {
          console.error('Server error:', error);
          process.exit(1);
        }
      }
    };

    startServer(parseInt(process.env.PORT, 10) || 5000);
  });