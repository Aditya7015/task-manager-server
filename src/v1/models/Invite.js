import mongoose, { Schema } from 'mongoose';
const schema = new Schema({
  project: { type: Schema.Types.ObjectId, ref: 'Project', required:true },
  email: { type:String, required:true },
  role: { type:String, enum:['member','owner'], default:'member' },
  token: { type:String, required:true, unique:true },
  used: { type:Boolean, default:false }
}, { timestamps:true });
export const Invite = mongoose.model('Invite', schema);
