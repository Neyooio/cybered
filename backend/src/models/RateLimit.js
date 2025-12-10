import mongoose from 'mongoose';

const rateLimitSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  date: { type: String, required: true, index: true }, // YYYY-MM-DD
  count: { type: Number, required: true, default: 0 },
}, { timestamps: true });

rateLimitSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model('RateLimit', rateLimitSchema);
