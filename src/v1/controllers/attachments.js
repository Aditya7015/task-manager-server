import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Task } from '../models/Task.js';
import { Project } from '../models/Project.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) { cb(null, path.resolve(__dirname, '../../uploads')); },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/ig,'_');
    const name = base + '_' + Date.now() + ext;
    cb(null, name);
  }
});
export const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

const can = async (taskId, userId)=>{
  const t = await Task.findById(taskId); if(!t) return null;
  const p = await Project.findById(t.project);
  if(!p) return null;
  if(!p.members.some(m=> String(m.user)===String(userId))) return null;
  return { t, p };
};

export const list = async (req,res)=>{
  const chk = await can(req.params.id, req.user.id); if(!chk) return res.status(403).json({ message:'Forbidden' });
  res.json({ items: chk.t.attachments || [] });
};

export const add = async (req,res)=>{
  const chk = await can(req.params.id, req.user.id); if(!chk) return res.status(403).json({ message:'Forbidden' });
  const file = req.file;
  const url = `/uploads/${file.filename}`;
  chk.t.attachments = chk.t.attachments || [];
  chk.t.attachments.push({ name: file.originalname, url, size: file.size });
  await chk.t.save();
  res.status(201).json({ name:file.originalname, url, size:file.size });
};

export const remove = async (req,res)=>{
  const chk = await can(req.params.id, req.user.id); if(!chk) return res.status(403).json({ message:'Forbidden' });
  const { url } = req.body;
  chk.t.attachments = (chk.t.attachments||[]).filter(a => a.url !== url);
  await chk.t.save();
  try { fs.unlinkSync(path.resolve(__dirname, '../../', url.startsWith('/')? url.slice(1): url)); } catch {}
  res.json({ ok:true });
};
