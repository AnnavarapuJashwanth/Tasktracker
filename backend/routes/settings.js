import express from 'express';
import Settings from '../models/Settings.js';

const router = express.Router();

// Get current settings
router.get('/get', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // If no settings exist, create default ones
    if (!settings) {
      settings = new Settings({
        adminPin: process.env.ADMIN_PIN || '1234',
        adminPhone: '+919908939746',
      });
      await settings.save();
    }

    res.json({
      success: true,
      adminPin: settings.adminPin,
      adminPhone: settings.adminPhone,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message,
    });
  }
});

// Update PIN
router.post('/update-pin', async (req, res) => {
  try {
    const { currentPin, newPin } = req.body;

    if (!currentPin || !newPin) {
      return res.status(400).json({
        success: false,
        message: 'Current PIN and new PIN are required',
      });
    }

    // Find settings
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({
        adminPin: process.env.ADMIN_PIN || '1234',
        adminPhone: '+919908939746',
      });
    }

    // Verify current PIN
    if (settings.adminPin !== currentPin) {
      console.log('❌ PIN update failed - Current PIN is incorrect');
      console.log('Expected:', settings.adminPin, 'Got:', currentPin);
      return res.status(401).json({
        success: false,
        message: 'Current PIN is incorrect',
      });
    }

    // Update PIN
    settings.adminPin = newPin;
    settings.updatedAt = new Date();
    await settings.save();

    console.log('✅ PIN updated successfully in database');

    res.json({
      success: true,
      message: 'PIN updated successfully',
      adminPin: newPin,
    });
  } catch (error) {
    console.error('Error updating PIN:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating PIN',
      error: error.message,
    });
  }
});

// Update admin phone
router.post('/update-phone', async (req, res) => {
  try {
    const { adminPhone } = req.body;

    if (!adminPhone) {
      return res.status(400).json({
        success: false,
        message: 'Admin phone is required',
      });
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({
        adminPin: process.env.ADMIN_PIN || '1234',
        adminPhone: adminPhone,
      });
    } else {
      settings.adminPhone = adminPhone;
    }

    settings.updatedAt = new Date();
    await settings.save();

    console.log('✅ Admin phone updated successfully');

    res.json({
      success: true,
      message: 'Admin phone updated successfully',
      adminPhone: adminPhone,
    });
  } catch (error) {
    console.error('Error updating phone:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating phone',
      error: error.message,
    });
  }
});

export default router;
