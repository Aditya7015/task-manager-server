import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { User } from '../models/User.js';
export const adminRoutes = Router();
adminRoutes.use(requireAuth);
adminRoutes.get('/users', async (_req,res)=>{
  const items = await User.find().sort({ createdAt:-1 }).limit(500);
  res.json({ items });
});
