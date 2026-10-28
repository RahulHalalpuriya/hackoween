import jwt from 'jsonwebtoken';
import { Farmer } from '../models/Farmer.js';

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'kisanai_hackathon_super_secret_jwt_key_2026';
    const decoded = jwt.verify(token, secret);
    
    const farmer = await Farmer.findById(decoded.id || decoded.farmerId);
    if (!farmer) {
      return res.status(401).json({ success: false, message: 'Farmer account not found' });
    }

    req.farmer = farmer;
    req.farmerId = farmer._id || farmer.id;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
}
