import mongoose, { Schema } from 'mongoose';
const schema = new Schema({
  project: { type: Schema.Types.ObjectId, ref: 'Project', required:true },
  actor: { type: Schema.Types.ObjectId, ref: 'User', required:true },
  type: { type:String, required:true },
  meta: { type: Object }
}, { timestamps:true });
export const Activity = mongoose.model('Activity', schema);
