import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user','admin'], default: 'user' },
  name: { type: String },
  avatarUrl: { type: String },
  avatarSrc: { type: String },
  avatarName: { type: String },
  avatar: { type: String },
}, { timestamps: true });

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    return ret;
  }
});

export default mongoose.model('User', userSchema);
