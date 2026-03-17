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

    let expectedPin = process.env.ADMIN_PIN || '1234';
    const envPin = process.env.ADMIN_PIN || '1234';

    try {
      // Try to get PIN from database with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('DB timeout')), 2000)
      );
      
      const dbFetch = Settings.findOne();
      const settings = await Promise.race([dbFetch, timeoutPromise]);
      
      if (settings) {
        // If database PIN doesn't match env PIN, update it to env PIN
        if (settings.adminPin !== envPin) {
          console.log('⚠️  Database PIN mismatches env PIN. Resetting to env PIN:', envPin);
          settings.adminPin = envPin;
          try {
            await settings.save();
            console.log('✅ Updated database PIN to match env PIN');
          } catch (updateError) {
            console.warn('⚠️  Could not update PIN:', updateError.message);
          }
        }
        expectedPin = envPin; // Always use env PIN
        console.log('✅ Using PIN from environment:', expectedPin);
      } else {
        // Create settings with env PIN if doesn't exist
        const newSettings = new Settings({
          adminPin: envPin,
          adminPhone: '+919908939746',
        });
        try {
          await newSettings.save();
          console.log('✅ Created settings with env PIN');
        } catch (saveError) {
          console.warn('⚠️  Could not save settings:', saveError.message);
        }
      }
    } catch (dbError) {
      console.warn('⚠️  Database unavailable for login, using environment PIN:', dbError.message);
      expectedPin = envPin;
    }

    console.log('Login attempt - Received PIN:', pin, 'Expected PIN:', expectedPin);

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
