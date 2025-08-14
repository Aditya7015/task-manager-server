import mongoose, { Schema } from 'mongoose';
const schema = new Schema({
  project: { type: Schema.Types.ObjectId, ref: 'Project', required:true },
  title: { type:String, required:true },
  description: String,
  status: { type:String, enum:['todo','in_progress','done'], default:'todo' },
  priority: { type:String, enum:['low','medium','high'], default:'medium' },
  dueDate: Date,
  assignee: { type: Schema.Types.ObjectId, ref: 'User' },
  labels: [String],
  attachments: [{ name:String, url:String, size:Number }],
  order: { type:Number, default:0 }
}, { timestamps:true });
export const Task = mongoose.model('Task', schema);
