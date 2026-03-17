import express from 'express';
import Settings from '../models/Settings.js';

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { pin } = req.body;

    // Get PIN from database first, fall back to env
    let settings = await Settings.findOne();
    if (!settings) {
      // Initialize settings with env PIN if not exists
      settings = new Settings({
        adminPin: process.env.ADMIN_PIN || '1234',
        adminPhone: '+919908939746',
      });
      await settings.save();
    }

    const expectedPin = settings.adminPin;

    console.log('Login attempt - Received PIN:', pin, 'Expected PIN from DB:', expectedPin);

    if (!pin || pin !== expectedPin) {
      console.log('❌ Login failed - Invalid PIN');
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid PIN' 
      });
    }

    console.log('✅ Login successful for PIN:', pin);
    res.json({ 
      success: true, 
      message: 'Login successful',
      pin: pin
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

export default router;
