require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Files static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve Frontend Static Build if in production (optional setup)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
}

// Register API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));

// Fallback HTML router for frontend single page router in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
} else {
  // Test/fallback endpoint
  app.get('/', (req, res) => {
    res.json({ message: 'Personal Portfolio API is running...' });
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[ERROR HANDLER]:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.'
  });
});

// Bootstrap Database and Start Server
async function startServer() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`============================================`);
      console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`Local Access: http://localhost:${PORT}`);
      console.log(`============================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
