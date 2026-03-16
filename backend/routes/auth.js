import express from 'express';

const router = express.Router();

// Login endpoint
router.post('/login', (req, res) => {
  try {
    const { pin } = req.body;
    const expectedPin = process.env.ADMIN_PIN;

    console.log('Login attempt - Received PIN:', pin, 'Expected PIN:', expectedPin);

    if (!pin || pin !== expectedPin) {
      console.log('Login failed - Invalid PIN');
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid PIN' 
      });
    }

    console.log('Login successful for PIN:', pin);
    res.json({ 
      success: true, 
      message: 'Login successful',
      pin: pin
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

export default router;
