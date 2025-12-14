import mongoose from 'mongoose';

const passwordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  website: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['social', 'email', 'banking', 'shopping', 'work', 'other'],
    default: 'other',
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Password', passwordSchema);

