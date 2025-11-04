import { connectDB } from "@/lib/db"
import { Response as QuizResponse } from "@/lib/models/response"
import { Quiz } from "@/lib/models/quiz"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const responses = await QuizResponse.find().lean().sort({ completedAt: -1 })

    const resultsWithQuizTitle = await Promise.all(
      responses.map(async (response) => {
        const quiz = await Quiz.findById(response.quizId).lean()
        return {
          ...response,
          quizTitle: quiz?.title || "Unknown Quiz",
        }
      }),
    )

    return NextResponse.json({ results: resultsWithQuizTitle })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 })
  }
}
