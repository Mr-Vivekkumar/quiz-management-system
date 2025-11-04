import mongoose from "mongoose"

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  createdBy: {
    type: String,
    required: true,
  },
  questions: [
    {
      id: String,
      question: String,
      questionType: {
        type: String,
        enum: ['MCQ', 'True/False', 'Text'],
        default: 'MCQ',
      },
      options: [String],
      correctAnswer: String,
      explanation: String,
    },
  ],
  isPublished: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema)
