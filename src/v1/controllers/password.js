import { User } from '../models/User.js';
import { PasswordResetToken } from '../models/PasswordResetToken.js';
import { customAlphabet } from 'nanoid';
import bcrypt from 'bcryptjs';

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 32);

export const requestReset = async (req,res)=>{
  const { email } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.json({ message:'If the email exists, a reset link will be generated.' });
  const token = nanoid();
  const expiresAt = new Date(Date.now() + 1000*60*30);
  await PasswordResetToken.create({ user: user._id, token, expiresAt });
  res.json({ resetLink: `/auth/reset?token=${token}` });
};

export const resetPassword = async (req,res)=>{
  const { token, password } = req.body;
  const rec = await PasswordResetToken.findOne({ token, expiresAt: { $gt: new Date() } });
  if(!rec) return res.status(400).json({ message:'Invalid or expired token' });
  const passwordHash = await bcrypt.hash(password, 10);
  await User.updateOne({ _id: rec.user }, { $set: { passwordHash } });
  await PasswordResetToken.deleteOne({ _id: rec._id });
  res.json({ ok:true });
};
