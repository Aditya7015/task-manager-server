import mongoose, { Schema } from 'mongoose';
const memberSchema = new Schema({ user: { type: Schema.Types.ObjectId, ref: 'User', required:true }, role: { type:String, enum:['owner','member'], default:'member' } }, {_id:false});
const schema = new Schema({
  name: { type:String, required:true },
  description: String,
  members: [memberSchema]
}, { timestamps:true });
export const Project = mongoose.model('Project', schema);
