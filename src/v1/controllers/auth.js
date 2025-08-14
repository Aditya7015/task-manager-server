import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { sign } from '../middleware/auth.js';

export const register = async (req,res)=>{
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if(exists) return res.status(409).json({ message:'Email in use' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  const access = sign({ id:user.id, role:user.role, name:user.name });
  res.status(201).json({ user:{ id:user.id, name:user.name, email:user.email, role:user.role }, access });
};

export const login = async (req,res)=>{
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.status(401).json({ message:'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if(!ok) return res.status(401).json({ message:'Invalid credentials' });
  const access = sign({ id:user.id, role:user.role, name:user.name });
  res.json({ user:{ id:user.id, name:user.name, email:user.email, role:user.role }, access });
};
