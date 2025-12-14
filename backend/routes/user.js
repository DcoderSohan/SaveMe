import express from 'express';
import multer from 'multer';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { authenticateToken } from '../middleware/auth.js';
import { uploadAvatar, deleteFromCloudinary, extractPublicId } from '../utils/cloudinary.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { displayName, email } = req.body;
    const updateData = {};
    
    if (displayName) updateData.displayName = displayName;
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ email, _id: { $ne: req.user.userId } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      updateData.email = email.toLowerCase();
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload/Update avatar
router.post('/avatar', authenticateToken, (req, res, next) => {
  uploadAvatar.single('avatar')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File size too large. Maximum size is 5MB' });
        }
        return res.status(400).json({ error: err.message });
      }
      return res.status(400).json({ error: err.message || 'Invalid file type. Only images are allowed.' });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please select an image file.' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete old avatar from Cloudinary if exists
    if (user.avatar) {
      try {
        const publicId = extractPublicId(user.avatar);
        if (publicId) {
          await deleteFromCloudinary(`password-manager/avatars/${publicId}`);
        }
      } catch (deleteError) {
        console.error('Error deleting old avatar from Cloudinary:', deleteError);
        // Continue even if deletion fails
      }
    }

    // Update user with new avatar URL
    // If using Cloudinary, req.file.path is the URL; otherwise it's the local path
    if (req.file.path && req.file.path.startsWith('http')) {
      user.avatar = req.file.path; // Cloudinary URL
    } else {
      // Local storage - use relative path for serving
      user.avatar = `/uploads/avatars/${req.file.filename}`;
    }
    await user.save();

    res.json({
      message: 'Avatar uploaded successfully',
      avatar: user.avatar
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ error: error.message || 'Failed to upload avatar' });
  }
});

// Delete avatar
router.delete('/avatar', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.avatar) {
      try {
        const publicId = extractPublicId(user.avatar);
        if (publicId) {
          await deleteFromCloudinary(`password-manager/avatars/${publicId}`);
        }
      } catch (deleteError) {
        console.error('Error deleting avatar from Cloudinary:', deleteError);
        // Continue even if deletion fails
      }
      user.avatar = null;
      await user.save();
    }

    res.json({ message: 'Avatar deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

