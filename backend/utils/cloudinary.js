import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

// ES Module path handling
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Fallback: Local storage for avatars
const avatarsDir = join(__dirname, '..', 'uploads', 'avatars');
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

const localAvatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, (req.user?.userId || 'user') + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Fallback: Local storage for documents
const documentsDir = join(__dirname, '..', 'uploads', 'documents');
if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
}

const localDocumentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, documentsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Use local storage by default (Cloudinary is optional)
export const uploadAvatar = multer({
  storage: localAvatarStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export const uploadDocument = multer({
  storage: localDocumentStorage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Helper function to delete file from local storage
export const deleteFromCloudinary = async (publicId) => {
  try {
    // publicId might be a full path or just filename
    let filePath;
    if (publicId.startsWith('uploads/')) {
      filePath = join(__dirname, '..', publicId);
    } else if (publicId.includes('/')) {
      filePath = join(__dirname, '..', 'uploads', publicId);
    } else {
      // Try both avatars and documents
      const avatarPath = join(avatarsDir, publicId);
      const docPath = join(documentsDir, publicId);
      if (fs.existsSync(avatarPath)) {
        filePath = avatarPath;
      } else if (fs.existsSync(docPath)) {
        filePath = docPath;
      } else {
        return { result: 'ok' }; // File not found, consider it deleted
      }
    }
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return { result: 'ok' };
  } catch (error) {
    console.error('Error deleting local file:', error);
    // Don't throw, just log
    return { result: 'ok' };
  }
};

// Helper function to extract public_id from Cloudinary URL or local path
export const extractPublicId = (url) => {
  if (!url) return null;
  
  // If it's a local path, return the filename
  if (!url.startsWith('http')) {
    return path.basename(url, path.extname(url));
  }
  
  try {
    // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{version}/{public_id}.{format}
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const uploadIndex = pathParts.indexOf('upload');
    
    if (uploadIndex === -1) return null;
    
    // Get everything after 'upload' (skip version if present)
    let publicIdParts = pathParts.slice(uploadIndex + 1);
    
    // Remove version if it's a number
    if (publicIdParts[0] && /^v\d+$/.test(publicIdParts[0])) {
      publicIdParts = publicIdParts.slice(1);
    }
    
    // Join and remove file extension
    let publicId = publicIdParts.join('/');
    const lastDot = publicId.lastIndexOf('.');
    if (lastDot !== -1) {
      publicId = publicId.substring(0, lastDot);
    }
    
    return publicId;
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
};

export default null;
