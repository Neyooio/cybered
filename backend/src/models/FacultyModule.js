import mongoose from 'mongoose';

const facultySpaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  spaceCode: { type: String, required: true, unique: true, index: true },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  creatorName: { type: String, required: true },
  theme: {
    primaryColor: { type: String, default: '#1d4ed8' },
    accentColor: { type: String, default: '#f97316' },
    backgroundImage: { type: String, default: '' }
  },
  isPublished: { type: Boolean, default: false },
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  modules: [{
    title: { type: String, required: true },
    description: { type: String, default: '' },
    iconUrl: { type: String },
    color: { type: String, default: '#1d4ed8' },
    order: { type: Number, default: 0 },
    content: {
      text: { type: String, default: '' },
      images: [{
        name: { type: String },
        data: { type: String },
        size: { type: String }
      }]
    },
    materials: [{
      type: { type: String, enum: ['pdf', 'link', 'video', 'document'], required: true },
      title: { type: String, required: true },
      url: { type: String, required: true },
      description: { type: String },
      fileSize: { type: String },
      uploadedAt: { type: Date, default: Date.now }
    }],
    lessons: [{
      title: { type: String, required: true },
      content: { type: String, required: true },
      videoUrl: { type: String },
      order: { type: Number, required: true }
    }],
    quizzes: [{
      title: { type: String, required: true },
      description: { type: String },
      questions: [{
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: Number, required: true },
        explanation: { type: String }
      }],
      passingScore: { type: Number, default: 70 }
    }]
  }],
  announcements: [{
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  assignments: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date },
    maxScore: { type: Number, default: 100 }
  }]
}, { timestamps: true });

facultySpaceSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model('FacultySpace', facultySpaceSchema);
