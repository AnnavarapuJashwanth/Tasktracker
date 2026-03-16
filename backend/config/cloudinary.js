import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

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
