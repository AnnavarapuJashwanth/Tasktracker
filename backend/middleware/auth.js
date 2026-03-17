import Settings from '../models/Settings.js';

// Centralized authentication middleware
export const adminAuth = async (req, res, next) => {
  try {
    // Get PIN from headers (Express converts headers to lowercase)
    const adminPin = req.headers.adminpin || req.headers['admin-pin'] || req.headers.adminpin;
    
    // Fetch PIN from database
    let settings = await Settings.findOne();
    
    // If no settings exist, create default with env var
    if (!settings) {
      settings = new Settings({
        adminPin: process.env.ADMIN_PIN || '1234',
        adminPhone: '+919908939746',
      });
      await settings.save();
    }
    
    const expectedPin = settings.adminPin;
    
    console.log('🔐 Auth Check - Received PIN:', adminPin, 'Expected PIN:', expectedPin);
    
    if (!adminPin || adminPin !== expectedPin) {
      console.log('❌ Auth failed. Expected:', expectedPin, 'Got:', adminPin);
      return res.status(401).json({ message: 'Unauthorized - Invalid PIN' });
    }
    
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    return res.status(500).json({ message: 'Authentication error', error: error.message });
  }
};

export default adminAuth;
