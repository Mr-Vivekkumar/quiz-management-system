import { connectDB } from "@/lib/db"
import { Quiz } from "@/lib/models/quiz"
import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()

    const { id } = await params
    const body = await request.json()
    const { isPublished } = body

    const quiz = await Quiz.findByIdAndUpdate(id, { isPublished, updatedAt: new Date() }, { new: true })

    return NextResponse.json({ quiz })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update quiz" }, { status: 500 })
  }
}
