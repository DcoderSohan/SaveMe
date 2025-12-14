import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      console.log('No token provided in request');
      return res.status(401).json({ error: 'Access token required' });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    
    if (!JWT_SECRET || JWT_SECRET === 'your-secret-key') {
      console.warn('⚠️  Warning: Using default JWT_SECRET. Set a secure secret in .env file!');
    }
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('Token verification failed:', err.message);
        return res.status(403).json({ error: 'Invalid or expired token' });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Authentication error' });
  }
};

