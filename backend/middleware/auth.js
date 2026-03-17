import Settings from '../models/Settings.js';

// Centralized authentication middleware with fallback
export const adminAuth = async (req, res, next) => {
  try {
    // Get PIN from headers (Express converts headers to lowercase)
    const adminPin = req.headers.adminpin || req.headers['admin-pin'] || req.headers.adminpin;
    
    const envPin = process.env.ADMIN_PIN || '1234';
    let expectedPin = envPin;
    
    try {
      // Try to fetch PIN from database with a short timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('DB timeout')), 2000)
      );
      
      const dbFetch = Settings.findOne();
      const settings = await Promise.race([dbFetch, timeoutPromise]);
      
      if (settings) {
        // If database PIN doesn't match env PIN, reset it
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
        console.log('🔐 Auth Check - Using PIN from environment:', expectedPin);
      }
    } catch (dbError) {
      // Database unavailable, use env PIN
      console.warn('⚠️  Database unavailable, using environment PIN:', dbError.message);
      expectedPin = envPin;
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
