import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

console.log('📦 Starting server...');

// Import routes
let authRoutes, passwordRoutes, documentRoutes, userRoutes;

try {
  const authModule = await import('./routes/auth.js');
  authRoutes = authModule.default;
  console.log('✅ Auth routes imported');
} catch (error) {
  console.error('❌ Failed to import auth routes:', error.message);
  process.exit(1);
}

try {
  const passwordModule = await import('./routes/passwords.js');
  passwordRoutes = passwordModule.default;
  console.log('✅ Password routes imported');
} catch (error) {
  console.error('❌ Failed to import password routes:', error.message);
  process.exit(1);
}

try {
  const documentModule = await import('./routes/documents.js');
  documentRoutes = documentModule.default;
  console.log('✅ Document routes imported');
} catch (error) {
  console.error('❌ Failed to import document routes:', error.message);
  process.exit(1);
}

try {
  const userModule = await import('./routes/user.js');
  userRoutes = userModule.default;
  console.log('✅ User routes imported');
} catch (error) {
  console.error('❌ Failed to import user routes:', error.message);
  console.error('Full error:', error);
  process.exit(1);
}

// ES Module path handling
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS configuration
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:3000', 
  'http://127.0.0.1:5173',
  'https://saveme-kvh1.onrender.com'
];

// Add frontend URL from environment if provided
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Log for debugging
      console.log('CORS: Origin not allowed:', origin);
      // Allow the request anyway for now (you can make this stricter in production)
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  preflightContinue: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`\n📥 ${req.method} ${req.path}`);
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    console.log('✅ Authorization header present, token length:', token?.length || 0);
  } else {
    console.log('❌ No Authorization header');
  }
  next();
});

// Create uploads directory if it doesn't exist
const uploadsDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const avatarsDir = join(uploadsDir, 'avatars');
const documentsDir = join(uploadsDir, 'documents');
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}
if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
}

// Serve static files
app.use('/uploads', express.static(uploadsDir));
app.use('/uploads/avatars', express.static(avatarsDir));
app.use('/uploads/documents', express.static(documentsDir));

// Database connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env file');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Routes - with error handling
try {
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes registered');
} catch (error) {
  console.error('❌ Error registering auth routes:', error);
}

try {
  app.use('/api/passwords', passwordRoutes);
  console.log('✅ Password routes registered');
} catch (error) {
  console.error('❌ Error registering password routes:', error);
}

try {
  app.use('/api/documents', documentRoutes);
  console.log('✅ Document routes registered');
} catch (error) {
  console.error('❌ Error registering document routes:', error);
}

try {
  app.use('/api/user', userRoutes);
  console.log('✅ User routes registered');
} catch (error) {
  console.error('❌ Error registering user routes:', error);
  console.error('Error details:', error.message);
  console.error('Stack:', error.stack);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Test route to verify user routes are working
app.get('/api/test/user-routes', (req, res) => {
  res.json({ 
    message: 'User routes test',
    routesRegistered: !!userRoutes,
    routesType: typeof userRoutes
  });
});

// 404 handler for undefined routes
app.use('/api/*', (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    path: req.originalUrl,
    availableRoutes: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/user/profile',
      'GET /api/passwords',
      'GET /api/documents',
      'GET /api/health'
    ]
  });
});

// Error handling middleware - must be after all routes
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`📋 Routes registered:`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - GET  /api/user/profile`);
  console.log(`   - GET  /api/passwords`);
  console.log(`   - GET  /api/documents`);
  console.log(`   - GET  /api/health`);
});

