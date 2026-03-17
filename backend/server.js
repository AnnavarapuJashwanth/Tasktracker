import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import connectDB, { getDBStatus } from './config/db.js';
import authRoutes from './routes/auth.js';
import tasksRoutes from './routes/tasks.js';
import contactsRoutes from './routes/contacts.js';
import whatsappRoutes from './routes/whatsapp.js';
import settingsRoutes from './routes/settings.js';

// Get the directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file explicitly from backend directory
dotenv.config({ path: path.join(__dirname, '.env') });
console.log('📁 Loading .env from:', path.join(__dirname, '.env'));

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration - allow both local and production
const allowedOrigins = [
  // Local development
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  // Production - Netlify
  'https://tasktracker4297.netlify.app',
  'https://tasktracker-4xm2.onrender.com',
  // Add any custom domain or additional frontend URLs
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'adminPin', 'admin-pin']
}));

// Log allowed origins for debugging
console.log('✅ CORS enabled for origins:', allowedOrigins);

// Static file serving for uploads
// Configure express.static with proper cache and encoding handling
app.use('/uploads', express.static('uploads', {
  maxAge: '7d',  // Cache for 7 days
  etag: true,    // Enable ETag for file versioning
  setHeaders: (res, path) => {
    // Disable caching for HTML files
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    // Allow proper MIME types
    if (path.endsWith('.png')) res.setHeader('Content-Type', 'image/png');
    if (path.endsWith('.jpg') || path.endsWith('.jpeg')) res.setHeader('Content-Type', 'image/jpeg');
    if (path.endsWith('.gif')) res.setHeader('Content-Type', 'image/gif');
    if (path.endsWith('.webp')) res.setHeader('Content-Type', 'image/webp');
  }
}));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/settings', settingsRoutes);

// Serve the frontend build in production
// Check if frontend dist folder exists
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDistPath)) {
  console.log('📦 Serving frontend from:', frontendDistPath);
  // Serve static files from the frontend dist folder
  app.use(express.static(frontendDistPath, {
    maxAge: '1y',
    etag: true,
    setHeaders: (res, servedPath) => {
      // Never cache HTML entry points so users always get latest JS bundle references.
      if (servedPath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
    }
  }));
  
  // SPA fallback: serve index.html for all non-API routes
  app.get(/^\/(?!api\/)/, (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  console.log('⚠️  Frontend dist folder not found at:', frontendDistPath);
}

// Root API endpoint
app.get('/api', (req, res) => {
  res.json({
    message: '✅ Backend is running successfully!',
    status: 'active',
    version: '1.0.0',
    database: 'MongoDB Atlas Connected',
    endpoints: {
      tasks: '/api/tasks',
      contacts: '/api/contacts',
      whatsapp: '/api/whatsapp',
      health: '/api/health',
      auth: '/api/auth/login'
    }
  });
});

// Root endpoint (HTML fallback)
app.get('/', (req, res) => {
  if (fs.existsSync(frontendDistPath)) {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  } else {
    res.json({
      message: '✅ Backend is running successfully!',
      status: 'active',
      version: '1.0.0',
      database: 'MongoDB Atlas Connected'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  res.json({ 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    status: dbStatus.connected ? 'ONLINE' : 'OFFLINE'
  });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { pin } = req.body;
  const expectedPin = (process.env.ADMIN_PIN || '1234').trim();
  const receivedPin = String(pin || '').trim();
  
  console.log('Login attempt - Expected PIN:', expectedPin, 'Received PIN:', receivedPin);

  if (receivedPin === expectedPin) {
    res.json({
      success: true,
      message: 'Login successful',
      token: 'admin-token',
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid PIN',
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
