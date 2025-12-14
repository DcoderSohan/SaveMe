import express from 'express';
import Password from '../models/Password.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all passwords for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const passwords = await Password.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(passwords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single password
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const password = await Password.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!password) {
      return res.status(404).json({ error: 'Password not found' });
    }
    
    res.json(password);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create password
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, username, password, website, category, notes } = req.body;

    if (!title || !password) {
      return res.status(400).json({ error: 'Title and password are required' });
    }

    const newPassword = new Password({
      userId: req.user.userId,
      title,
      username,
      password,
      website,
      category: category || 'other',
      notes
    });

    await newPassword.save();
    res.status(201).json(newPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update password
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, username, password, website, category, notes } = req.body;

    const updatedPassword = await Password.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, username, password, website, category: category || 'other', notes },
      { new: true, runValidators: true }
    );

    if (!updatedPassword) {
      return res.status(404).json({ error: 'Password not found' });
    }

    res.json(updatedPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete password
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deletedPassword = await Password.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!deletedPassword) {
      return res.status(404).json({ error: 'Password not found' });
    }

    res.json({ message: 'Password deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

