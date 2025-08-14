import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { Activity } from '../models/Activity.js';
import { emitProject } from '../utils/rt.js';

export const myProjects = async (req,res)=>{
  const items = await Project.find({ 'members.user': req.user.id });
  res.json({ items });
};

export const create = async (req,res)=>{
  const { name, description } = req.body;
  const p = await Project.create({ name, description, members:[{ user:req.user.id, role:'owner' }] });
  await Activity.create({ project:p._id, actor:req.user.id, type:'project_created', meta:{ name } });
  res.status(201).json(p);
};

export const addMember = async (req,res)=>{
  const { projectId, userId, role='member' } = req.body;
  const p = await Project.findById(projectId);
  if(!p) return res.status(404).json({ message:'Not found' });
  const me = p.members.find(m => String(m.user)===String(req.user.id));
  if(!me || me.role!=='owner') return res.status(403).json({ message:'Owner only' });
  if(p.members.some(m=> String(m.user)===String(userId))) return res.status(409).json({ message:'Already a member' });
  p.members.push({ user:userId, role });
  await p.save();
  await Activity.create({ project:p._id, actor:req.user.id, type:'member_added', meta:{ userId } });
  emitProject(p._id, 'project:member_added', { userId, role });
  res.json(p);
};

export const activity = async (req,res)=>{
  const items = await Activity.find({ project: req.params.id }).sort({ createdAt:-1 }).limit(100);
  res.json({ items });
};

export const board = async (req,res)=>{
  const tasks = await Task.find({ project: req.params.id }).sort({ order:1, createdAt:1 });
  res.json({ items: tasks });
};
