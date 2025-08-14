import mongoose, { Schema } from 'mongoose';
const schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required:true },
  token: { type:String, required:true, unique:true },
  expiresAt: { type: Date, required:true }
}, { timestamps:true });
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const PasswordResetToken = mongoose.model('PasswordResetToken', schema);
