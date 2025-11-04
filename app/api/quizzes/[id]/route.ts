import { connectDB } from "@/lib/db"
import { Quiz } from "@/lib/models/quiz"
import { type NextRequest, NextResponse } from "next/server"

interface QuizDocument {
  _id: string
  title: string
  description?: string
  createdBy: string
  questions: Array<{
    id: string
    question: string
    questionType: 'MCQ' | 'True/False' | 'Text'
    options: string[]
    correctAnswer: string
    explanation?: string
  }>
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    
    const { id } = await params

    const quiz = await Quiz.findById<QuizDocument>(id).lean()

    if (!quiz || !quiz.isPublished) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    return NextResponse.json({ quiz })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 })
  }
}
