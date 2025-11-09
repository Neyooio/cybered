import mongoose from 'mongoose';

const monsterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  module: {
    type: String,
    required: true,
    enum: ['cryptography', 'malware-defense', 'network-defense', 'web-security']
  },
  spriteUrl: {
    type: String,
    required: true
  },
  audioUrl: {
    type: String,
    required: false
  },
  maxHealth: {
    type: Number,
    default: 10  // 10 HP for 10 questions
  },
  level: {
    type: Number,
    default: 1
  },
  type: {
    type: String,
    enum: ['virus', 'trojan', 'worm', 'ransomware', 'spyware', 'defender'],
    default: 'virus'
  }
}, {
  timestamps: true
});

// Static method to get random monster for a module
monsterSchema.statics.getRandomMonster = async function(module) {
  const monsters = await this.aggregate([
    { $match: { module } },
    { $sample: { size: 1 } }
  ]);
  return monsters[0];
};

export default mongoose.model('Monster', monsterSchema);
