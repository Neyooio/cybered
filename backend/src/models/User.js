import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user','faculty','admin'], default: 'user' },
  name: { type: String },
  bio: { type: String },
  avatarUrl: { type: String },
  avatarSrc: { type: String },
  avatarName: { type: String },
  avatar: { type: String },
  // XP System
  experience: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  // Challenge Completions
  challengeProgress: [{
    challengeId: { type: String, required: true },
    completed: { type: Boolean, default: false },
    bestScore: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    lastPlayed: { type: Date },
    completedAt: { type: Date }
  }],
  // Notification Management
  deletedNotifications: [{ type: String }],
  readNotifications: [{ type: String }]
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
