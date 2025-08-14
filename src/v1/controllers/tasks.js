import { Task } from '../models/Task.js';
import { Project } from '../models/Project.js';
import { Comment } from '../models/Comment.js';
import { Activity } from '../models/Activity.js';
import { emitProject } from '../utils/rt.js';

const can = async (projectId, userId) => {
  const p = await Project.findById(projectId);
  if(!p) return null;
  if(!p.members.some(m=> String(m.user)===String(userId))) return null;
  return p;
};

export const create = async (req,res)=>{
  const { project, title, description='', status='todo', priority='medium', dueDate=null, assignee=null, labels=[] } = req.body;
  const p = await can(project, req.user.id); if(!p) return res.status(403).json({ message:'Forbidden' });
  const order = await Task.countDocuments({ project, status });
  const t = await Task.create({ project, title, description, status, priority, dueDate, assignee, labels, order });
  await Activity.create({ project, actor:req.user.id, type:'task_created', meta:{ taskId:t._id, title } });
  emitProject(project, 'task:created', t);
  res.status(201).json(t);
};

export const update = async (req,res)=>{
  const t = await Task.findById(req.params.id); if(!t) return res.status(404).json({ message:'Not found' });
  const p = await can(t.project, req.user.id); if(!p) return res.status(403).json({ message:'Forbidden' });
  Object.assign(t, req.body);
  await t.save();
  await Activity.create({ project:t.project, actor:req.user.id, type:'task_updated', meta:{ taskId:t._id } });
  emitProject(t.project, 'task:updated', t);
  res.json(t);
};

export const remove = async (req,res)=>{
  const t = await Task.findById(req.params.id); if(!t) return res.status(404).json({ message:'Not found' });
  const p = await can(t.project, req.user.id); if(!p) return res.status(403).json({ message:'Forbidden' });
  await Task.deleteOne({ _id:t._id });
  await Activity.create({ project:t.project, actor:req.user.id, type:'task_deleted', meta:{ taskId:t._id } });
  emitProject(t.project, 'task:deleted', { _id:t._id });
  res.json({ ok:true });
};

export const move = async (req,res)=>{
  const t = await Task.findById(req.params.id); if(!t) return res.status(404).json({ message:'Not found' });
  const p = await can(t.project, req.user.id); if(!p) return res.status(403).json({ message:'Forbidden' });
  const { status, toIndex } = req.body;

  // Shift tasks in target column
  const target = await Task.find({ project:t.project, status }).sort({ order:1 });
  for(let i=0;i<target.length;i++){ target[i].order = i + (i >= toIndex ? 1 : 0); await target[i].save(); }

  t.status = status; t.order = toIndex ?? 0; await t.save();
  emitProject(t.project, 'task:moved', t);
  res.json(t);
};

export const comments = async (req,res)=>{
  const items = await Comment.find({ task: req.params.id }).sort({ createdAt:1 });
  res.json({ items });
};
export const addComment = async (req,res)=>{
  const t = await Task.findById(req.params.id); if(!t) return res.status(404).json({ message:'Not found' });
  const c = await Comment.create({ task: t._id, author: req.user.id, text: req.body.text });
  emitProject(t.project, 'task:comment', { task: t._id, comment: c });
  res.status(201).json(c);
};
