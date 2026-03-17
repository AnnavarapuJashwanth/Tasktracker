import Settings from '../models/Settings.js';

// Centralized authentication middleware with fallback
export const adminAuth = async (req, res, next) => {
  try {
    // Get PIN from headers (Express converts headers to lowercase)
    const adminPin = req.headers.adminpin || req.headers['admin-pin'] || req.headers.adminpin;
    
    let expectedPin = process.env.ADMIN_PIN || '1234';
    
    try {
      // Try to fetch PIN from database with a short timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('DB timeout')), 2000)
      );
      
      const dbFetch = Settings.findOne();
      const settings = await Promise.race([dbFetch, timeoutPromise]);
      
      if (settings && settings.adminPin) {
        expectedPin = settings.adminPin;
        console.log('🔐 Auth Check - Using PIN from database');
      }
    } catch (dbError) {
      // Database unavailable, use env PIN
      console.warn('⚠️  Database unavailable, using environment PIN:', dbError.message);
      expectedPin = process.env.ADMIN_PIN || '1234';
    }
    
    console.log('🔐 Auth Check - Received PIN:', adminPin, 'Expected PIN:', expectedPin);
    
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
