import { Invite } from '../models/Invite.js';
import { Project } from '../models/Project.js';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 24);

export const createInvite = async (req,res)=>{
  const { projectId, email, role='member' } = req.body;
  const p = await Project.findById(projectId);
  if(!p) return res.status(404).json({ message:'Not found' });
  const me = p.members.find(m => String(m.user)===String(req.user.id));
  if(!me || me.role!=='owner') return res.status(403).json({ message:'Owner only' });
  const token = nanoid();
  const invite = await Invite.create({ project: p._id, email, role, token });
  res.status(201).json({ inviteUrl: `/invites/accept?token=${token}` });
};

export const acceptInvite = async (req,res)=>{
  const { token } = req.body;
  const inv = await Invite.findOne({ token, used:false });
  if(!inv) return res.status(400).json({ message:'Invalid invite' });
  const p = await Project.findById(inv.project);
  if(!p) return res.status(404).json({ message:'Project missing' });
  if(!p.members.some(m=> String(m.user)===String(req.user.id))){
    p.members.push({ user: req.user.id, role: inv.role });
    await p.save();
  }
  inv.used = true; await inv.save();
  res.json({ ok:true, projectId: p._id });
};
