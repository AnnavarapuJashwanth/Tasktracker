import express from 'express';
import Settings from '../models/Settings.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// DEBUG: Check current PIN in database (without auth - for debugging only)
router.get('/check-pin', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings({
        adminPin: process.env.ADMIN_PIN || '1234',
        adminPhone: '+919908939746',
      });
      await settings.save();
    }

    console.log('🔍 Current PIN in database:', settings.adminPin);
    res.json({
      currentPin: settings.adminPin,
      fromDatabase: true,
      message: 'This is the PIN currently stored in the database. Use this to login.'
    });
  } catch (error) {
    console.error('Error checking PIN:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking PIN',
      error: error.message,
    });
  }
});

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
    console.error('Error fetching settings:', error.message);
    // Fallback to environment variables if database unavailable
    res.json({
      success: true,
      adminPin: process.env.ADMIN_PIN || '1234',
      adminPhone: process.env.ADMIN_PHONE_NUMBER || '+919908939746',
      source: 'environment (database unavailable)',
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
    console.error('Error updating PIN:', error.message);
    // If database is unavailable, acknowledge the request but return error
    res.status(500).json({
      success: false,
      message: 'Database unavailable - PIN update failed. Please try again.',
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

// Sync PIN to .env file (for local development sync)
router.post('/sync-env', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Settings not found',
      });
    }

    // Path to .env file
    const envPath = path.join(__dirname, '../.env');
    
    // Read current .env file
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Update or add ADMIN_PIN
    if (envContent.includes('ADMIN_PIN=')) {
      envContent = envContent.replace(/ADMIN_PIN=.*/g, `ADMIN_PIN=${settings.adminPin}`);
    } else {
      envContent += `\nADMIN_PIN=${settings.adminPin}`;
    }

    // Write back to .env file
    fs.writeFileSync(envPath, envContent, 'utf8');

    console.log('✅ .env file synced with PIN:', settings.adminPin);

    res.json({
      success: true,
      message: 'PIN synced to .env file successfully',
      pin: settings.adminPin,
      file: envPath,
    });
  } catch (error) {
    console.error('Error syncing to .env:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to sync PIN to .env file',
      error: error.message,
    });
  }
});

export default router;
