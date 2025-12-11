import mongoose from 'mongoose';

/**
 * Leaderboard Model - Separate leaderboards for each challenge
 * 
 * Each challenge game (except Header Check) has its own leaderboard:
 * - Cyber Runner: Solo endless runner with score tracking
 * - Cyber Runner MP: Multiplayer runner with competitive scores
 * - Intrusion Intercept: Defense game with rating-based scoring
 * - Crypto Crack: Puzzle game with XP-based scoring
 * 
 * Header Check does NOT have a leaderboard as it has no scoring system.
 * Only students can appear on leaderboards (verified via middleware).
 */
const leaderboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  challengeName: {
    type: String,
    required: true,
    enum: ['Cyber Runner', 'Cyber Runner MP', 'Intrusion Intercept', 'Crypto Crack']
  },
  score: {
    type: Number,
    required: true,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  completionTime: {
    type: Number, // Time in seconds
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
leaderboardSchema.index({ challengeName: 1, score: -1 });
leaderboardSchema.index({ userId: 1, challengeName: 1 });

// Ensure only students can have leaderboard entries
leaderboardSchema.pre('save', async function(next) {
  const User = mongoose.model('User');
  const user = await User.findById(this.userId);
  
  if (!user) {
    return next(new Error('User not found'));
  }
  
  if (user.role !== 'student') {
    return next(new Error('Only students can be on the leaderboard'));
  }
  
  next();
});

export default mongoose.model('Leaderboard', leaderboardSchema);
