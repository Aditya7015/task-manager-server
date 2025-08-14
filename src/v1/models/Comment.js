import mongoose, { Schema } from 'mongoose';
const schema = new Schema({
  task: { type: Schema.Types.ObjectId, ref: 'Task', required:true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required:true },
  text: { type:String, required:true }
}, { timestamps:true });
export const Comment = mongoose.model('Comment', schema);
