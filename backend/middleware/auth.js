import Settings from '../models/Settings.js';

// Centralized authentication middleware with fallback
export const adminAuth = async (req, res, next) => {
  try {
    // Get PIN from headers (Express converts headers to lowercase)
    const adminPin = req.headers.adminpin || req.headers['admin-pin'] || req.headers.adminpin;
    
    let expectedPin = '1234'; // Default fallback
    let pinSource = 'default';
    
    try {
      // DATABASE IS SOURCE OF TRUTH - Fetch PIN from database with timeout (5 seconds)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('DB timeout')), 5000)
      );
      
      const dbFetch = Settings.findOne();
      const settings = await Promise.race([dbFetch, timeoutPromise]);
      
      if (settings && settings.adminPin) {
        expectedPin = settings.adminPin;
        pinSource = 'database (source of truth)';
        console.log('🔐 Auth Check - Using PIN from DATABASE:', expectedPin);
      } else {
        // Create settings if doesn't exist
        expectedPin = process.env.ADMIN_PIN || '1234';
        pinSource = 'environment (creating new)';
        const newSettings = new Settings({
          adminPin: expectedPin,
          adminPhone: '+919908939746',
        });
        try {
          await newSettings.save();
          console.log('✅ Created settings in database');
        } catch (saveError) {
          console.warn('⚠️  Could not save settings:', saveError.message);
        }
      }
    } catch (dbError) {
      // Database unavailable - use env PIN as fallback
      expectedPin = process.env.ADMIN_PIN || '1234';
      pinSource = 'environment (database timeout - fallback)';
      console.warn('⚠️  Database unavailable for auth, using fallback PIN:', dbError.message);
    }
    
    console.log('🔐 Auth Check - Expected PIN from', pinSource + ':', expectedPin, '| Received:', adminPin);
    
    if (!adminPin || adminPin !== expectedPin) {
      console.log('❌ Auth failed. Expected:', expectedPin, 'Got:', adminPin);
      return res.status(401).json({ message: 'Unauthorized - Invalid PIN' });
    }
    
    next();
  } catch (error) {
    console.error('❌ Auth error:', error.message);
    return res.status(500).json({ message: 'Authentication error', error: error.message });
  }
};

export default adminAuth;
