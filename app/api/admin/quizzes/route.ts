import { connectDB } from "@/lib/db"
import { Quiz } from "@/lib/models/quiz"
import { Response as QuizResponse } from "@/lib/models/response"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const quizzes = await Quiz.find().lean()

    const quizzesWithCounts = await Promise.all(
      quizzes.map(async (quiz) => {
        const responseCount = await QuizResponse.countDocuments({ quizId: quiz._id })
        return {
          ...quiz,
          questionCount: quiz.questions.length,
          responseCount,
        }
      }),
    )

    return NextResponse.json({ quizzes: quizzesWithCounts })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { title, description, questions } = body

    const quiz = new Quiz({
      title,
      description,
      questions,
      createdBy: "admin",
      isPublished: false,
    })

    await quiz.save()

    return NextResponse.json({ quiz, message: "Quiz created successfully" }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 })
  }
}
