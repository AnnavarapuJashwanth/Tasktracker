import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  adminPin: {
    type: String,
    default: process.env.ADMIN_PIN || '1234',
  },
  adminPhone: {
    type: String,
    default: '+919908939746',
  },
  sectors: {
    type: [String],
    default: ['Vignan University', 'Narasarapet Region'],
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
