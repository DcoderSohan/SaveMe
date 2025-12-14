import express from 'express';
import multer from 'multer';
import Document from '../models/Document.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadDocument, deleteFromCloudinary, extractPublicId } from '../utils/cloudinary.js';

const router = express.Router();

// Get all documents for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single document
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload document
router.post('/upload', authenticateToken, (req, res, next) => {
  uploadDocument.single('file')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File size too large. Maximum size is 50MB' });
        }
        return res.status(400).json({ error: err.message });
      }
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please select a file.' });
    }

    // Determine file path - Cloudinary returns URL, local storage returns path
    let filePath;
    if (req.file.path && req.file.path.startsWith('http')) {
      filePath = req.file.path; // Cloudinary URL
    } else {
      // Local storage - use relative path for serving
      filePath = `/uploads/documents/${req.file.filename}`;
    }

    const document = new Document({
      userId: req.user.userId,
      filename: req.file.filename || req.file.originalname,
      originalName: req.file.originalname,
      filePath: filePath,
      fileType: req.file.mimetype,
      fileSize: req.file.size
    });

    await document.save();
    res.status(201).json(document);
  } catch (error) {
    console.error('Error saving document:', error);
    res.status(500).json({ error: error.message || 'Failed to save document' });
  }
});

// Download document - redirect to Cloudinary URL
router.get('/:id/download', authenticateToken, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // If it's a Cloudinary URL, redirect to it with download parameter
    if (document.filePath && document.filePath.startsWith('http')) {
      // Add download parameter to Cloudinary URL
      const downloadUrl = document.filePath.replace('/upload/', '/upload/fl_attachment/');
      return res.redirect(downloadUrl);
    }

    // Fallback for local files (if any)
    res.status(404).json({ error: 'File not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete document
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Delete file from Cloudinary if it's a Cloudinary URL
    if (document.filePath && document.filePath.startsWith('http')) {
      try {
        const publicId = extractPublicId(document.filePath);
        if (publicId) {
          await deleteFromCloudinary(`password-manager/documents/${publicId}`);
        }
      } catch (deleteError) {
        console.error('Error deleting document from Cloudinary:', deleteError);
        // Continue even if deletion fails
      }
    }

    await Document.findByIdAndDelete(document._id);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

