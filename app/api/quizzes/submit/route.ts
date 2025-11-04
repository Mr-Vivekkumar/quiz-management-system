import { connectDB } from "@/lib/db"
import { Response as QuizResponse } from "@/lib/models/response"
import { Quiz } from "@/lib/models/quiz"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { quizId, userName, userEmail, answers } = body

    // Fetch the quiz to get correct answers and question types
    const quiz = await Quiz.findById(quizId)
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    // Calculate score based on question type
    let score = 0
    const processedAnswers = answers.map((answer: any) => {
      const question = quiz.questions.find((q: any) => q.id === answer.questionId)
      if (!question) {
        return { ...answer, isCorrect: false }
      }

      let isCorrect = false
      
      switch (question.questionType) {
        case "MCQ":
        case "True/False":
          isCorrect = answer.selectedAnswer === question.correctAnswer
          break
        case "Text":
          // For text questions, we'll do a case-insensitive comparison
          isCorrect = answer.selectedAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()
          break
        default:
          isCorrect = false
      }

      if (isCorrect) score++

      return {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
      }
    })

    const totalQuestions = quiz.questions.length
    const percentageScore = Math.round((score / totalQuestions) * 100)

    const response = new QuizResponse({
      quizId,
      userId: `${userEmail}-${Date.now()}`,
      userEmail,
      userName,
      answers: processedAnswers,
      score,
      totalQuestions,
      percentageScore,
      completedAt: new Date(),
    })

    await response.save()

    return NextResponse.json({ response, message: "Quiz submitted successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error submitting quiz:", error)
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 })
  }
}
