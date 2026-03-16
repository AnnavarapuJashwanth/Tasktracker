import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB, { getDBStatus } from './config/db.js';
import authRoutes from './routes/auth.js';
import tasksRoutes from './routes/tasks.js';
import contactsRoutes from './routes/contacts.js';
import whatsappRoutes from './routes/whatsapp.js';

dotenv.config();

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
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Root endpoint
app.get('/', (req, res) => {
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
