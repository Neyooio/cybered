import mongoose from 'mongoose';

const websiteConfigSchema = new mongoose.Schema({
  modules: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    enabled: { type: Boolean, default: true }
  }],
  challenges: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    difficulty: String,
    enabled: { type: Boolean, default: true }
  }],
  lastUpdated: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

// Ensure only one config document exists
websiteConfigSchema.statics.getConfig = async function() {
  let config = await this.findOne();
  if (!config) {
    // Create default config if none exists
    config = await this.create({
      modules: [
        {
          id: 'web-security',
          name: 'Web Security',
          description: 'Learn about protecting websites and web applications from attacks',
          enabled: true
        },
        {
          id: 'network-defense',
          name: 'Network Defense',
          description: 'Master network security fundamentals and defense strategies',
          enabled: true
        },
        {
          id: 'cryptography',
          name: 'Cryptography',
          description: 'Understand encryption and secure communication techniques',
          enabled: true
        },
        {
          id: 'malware-defense',
          name: 'Malware Defense',
          description: 'Detect, analyze, and defend against malicious software',
          enabled: true
        }
      ],
      challenges: [
        {
          id: 'cyber-runner',
          name: 'Cyber Runner',
          description: 'Jump over cyber threats in this endless runner game',
          difficulty: 'Easy',
          enabled: true
        },
        {
          id: 'crypto-crack',
          name: 'Crypto Crack',
          description: 'Decode encrypted messages using Caesar cipher',
          difficulty: 'Medium',
          enabled: true
        },
        {
          id: 'intrusion-intercept',
          name: 'Intrusion Intercept',
          description: 'Navigate real-world security breaches through branching scenarios',
          difficulty: 'Hard',
          enabled: true
        },
        {
          id: 'header-check',
          name: 'Header Check',
          description: 'Multiplayer card elimination game for email security',
          difficulty: 'Easy',
          enabled: true
        }
      ]
    });
  }
  return config;
};

const WebsiteConfig = mongoose.model('WebsiteConfig', websiteConfigSchema);

export default WebsiteConfig;
