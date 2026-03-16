import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file explicitly from backend directory
dotenv.config({ path: path.join(__dirname, '../.env') });

// Configure Cloudinary with credentials from .env
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

cloudinary.v2.config(cloudinaryConfig);

// Log Cloudinary configuration status
const isConfigured = !!(cloudinaryConfig.cloud_name && cloudinaryConfig.api_key && cloudinaryConfig.api_secret);
if (isConfigured) {
  console.log('✅ Cloudinary configured:', cloudinaryConfig.cloud_name);
} else {
  console.warn('⚠️ Cloudinary NOT fully configured. Missing credentials in .env');
  console.warn('  - CLOUDINARY_CLOUD_NAME:', cloudinaryConfig.cloud_name ? '✓' : '✗');
  console.warn('  - CLOUDINARY_API_KEY:', cloudinaryConfig.api_key ? '✓' : '✗');
  console.warn('  - CLOUDINARY_API_SECRET:', cloudinaryConfig.api_secret ? '✓' : '✗');
}

export default cloudinary;
