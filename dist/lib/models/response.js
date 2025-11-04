import mongoose from "mongoose";
const responseSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    userEmail: String,
    userName: String,
    answers: [
        {
            questionId: String,
            selectedAnswer: String,
            isCorrect: Boolean,
        },
    ],
    score: Number,
    totalQuestions: Number,
    percentageScore: Number,
    completedAt: {
        type: Date,
        default: Date.now,
    },
});
export const Response = mongoose.models.Response || mongoose.model("Response", responseSchema);
