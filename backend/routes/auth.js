import express from 'express';
import Settings from '../models/Settings.js';

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { pin } = req.body;
    
    if (!pin) {
      return res.status(400).json({
        success: false,
        message: 'PIN is required'
      });
    }

    let expectedPin = '1234'; // Default fallback
    let pinSource = 'default';

    try {
      // DATABASE IS SOURCE OF TRUTH - Try to get PIN from database first
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('DB timeout')), 2000)
      );
      
      const dbFetch = Settings.findOne();
      const settings = await Promise.race([dbFetch, timeoutPromise]);
      
      if (settings && settings.adminPin) {
        expectedPin = settings.adminPin;
        pinSource = 'database (source of truth)';
        console.log('✅ Using PIN from DATABASE:', expectedPin);
      } else {
        // Create settings with env PIN if database doesn't exist
        expectedPin = process.env.ADMIN_PIN || '1234';
        pinSource = 'environment (creating new)';
        const newSettings = new Settings({
          adminPin: expectedPin,
          adminPhone: '+919908939746',
        });
        try {
          await newSettings.save();
          console.log('✅ Created settings in database with PIN:', expectedPin);
        } catch (saveError) {
          console.warn('⚠️  Could not save settings:', saveError.message);
        }
      }
    } catch (dbError) {
      // Database unavailable - use env PIN as fallback only
      expectedPin = process.env.ADMIN_PIN || '1234';
      pinSource = 'environment (database timeout - fallback)';
      console.warn('⚠️  Database unavailable, using fallback PIN from .env:', dbError.message);
    }

    console.log('📝 Login attempt - Expected PIN from', pinSource + ':', expectedPin, '| Received:', pin);

    if (pin !== expectedPin) {
      console.log('❌ Login failed - Invalid PIN');
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid PIN' 
      });
    }

    console.log('✅ Login successful');
    res.json({ 
      success: true, 
      message: 'Login successful',
      pin: pin
    });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login',
      error: error.message
    });
  }
});

export default router;
