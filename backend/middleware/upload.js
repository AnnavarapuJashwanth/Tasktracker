import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

// Use memory storage since we'll upload to Cloudinary
const storage = multer.memoryStorage();

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  // Allowed mime types
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Create multer instance with limits
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

// Middleware to upload file to Cloudinary after multer processing
export const uploadToCloudinary = async (req, res, next) => {
  if (!req.file) {
    console.log('No file in request, skipping Cloudinary upload');
    return next();
  }

  try {
    console.log('🚀 Starting Cloudinary upload for:', req.file.originalname);
    
    // Upload to Cloudinary from memory buffer
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        {
          folder: 'task-tracker',
          resource_type: 'auto',
          public_id: `${Date.now()}-${req.file.originalname.split('.')[0]}`,
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('✅ Cloudinary upload successful:', result.secure_url);
            resolve(result);
          }
        }
      );
      stream.end(req.file.buffer);
    });

    // Store Cloudinary URL in request for later use
    req.file.cloudinaryUrl = result.secure_url;
    req.file.path = result.secure_url; // Use Cloudinary URL as path
    
    console.log('📸 File stored as:', req.file.cloudinaryUrl);
    next();
  } catch (error) {
    console.error('❌ Cloudinary middleware error:', error.message);
    req.cloudinaryError = error; // Store error for route handler
    // Don't send response here, let route handle it
    req.file.cloudinaryUrl = null;
    next();
  }
};

export default upload;
