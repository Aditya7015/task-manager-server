import dotenv from 'dotenv'; dotenv.config();
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './v1/models/User.js';
import { Project } from './v1/models/Project.js';
import { Task } from './v1/models/Task.js';

async function main(){
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27021/task_manager_pro_v3');
  await Promise.all([User.deleteMany({}), Project.deleteMany({}), Task.deleteMany({})]);

  const mk = async (name, email, role='user') => {
    const passwordHash = await bcrypt.hash('password', 10);
    return User.create({ name, email, passwordHash, role });
  };
  const alice = await mk('Alice Owner','alice@example.com');
  const bob = await mk('Bob Member','bob@example.com');
  const admin = await mk('Admin','admin@example.com','admin');

  const p = await Project.create({ name:'Website Redesign', description:'Marketing site revamp', members:[
    { user: alice._id, role:'owner' },
    { user: bob._id, role:'member' }
  ]});

  await Task.insertMany([
    { project:p._id, title:'Create wireframes', status:'todo', priority:'high', order:0 },
    { project:p._id, title:'Set up CI/CD', status:'in_progress', priority:'medium', order:0 },
    { project:p._id, title:'Deploy to staging', status:'done', priority:'low', order:0 }
  ]);

  console.log('Seeded users, project, tasks');
  await mongoose.disconnect();
}
main().catch(e=>{ console.error(e); process.exit(1); });
