import { connectDB } from "@/lib/db"
import { Quiz } from "@/lib/models/quiz"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const quizzes = await Quiz.find({ isPublished: true }).lean()

    const quizzesWithCounts = quizzes.map((quiz) => ({
      ...quiz,
      questionCount: quiz.questions.length,
    }))

    return NextResponse.json({ quizzes: quizzesWithCounts })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 })
  }
}
