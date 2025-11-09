import mongoose from 'mongoose';

const quizQuestionSchema = new mongoose.Schema({
  module: {
    type: String,
    required: true,
    enum: ['cryptography', 'malware-defense', 'network-defense', 'web-security']
  },
  lessonNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  question: {
    type: String,
    required: true
  },
  choices: [{
    text: String,
    isCorrect: Boolean
  }],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  explanation: {
    type: String
  },
  points: {
    type: Number,
    default: 100
  }
}, {
  timestamps: true
});

// Ensure each question has exactly 4 choices
quizQuestionSchema.pre('save', function(next) {
  if (this.choices.length !== 4) {
    next(new Error('Each question must have exactly 4 choices'));
  }
  
  const correctChoices = this.choices.filter(c => c.isCorrect);
  if (correctChoices.length !== 1) {
    next(new Error('Each question must have exactly 1 correct answer'));
  }
  
  next();
});

// Static method to get random questions for a lesson
quizQuestionSchema.statics.getRandomQuestions = async function(module, lessonNumber, count = 10) {
  return this.aggregate([
    { $match: { module, lessonNumber } },
    { $sample: { size: count } }
  ]);
};

export default mongoose.model('QuizQuestion', quizQuestionSchema);
