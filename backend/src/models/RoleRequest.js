import mongoose from 'mongoose';

const roleRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  currentRole: { type: String, required: true },
  requestedRole: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminResponse: { type: String },
  respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  respondedAt: { type: Date }
}, { timestamps: true });

roleRequestSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model('RoleRequest', roleRequestSchema);
