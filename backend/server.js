import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import tasksRoutes from './routes/tasks.js';
import contactsRoutes from './routes/contacts.js';
import whatsappRoutes from './routes/whatsapp.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/tasks', tasksRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { pin } = req.body;

  if (pin === process.env.ADMIN_PIN) {
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
