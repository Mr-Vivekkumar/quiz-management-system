import { connectDB } from "@/lib/db";
import { Quiz } from "@/lib/models/quiz";
import { NextResponse } from "next/server";
export async function GET(request, { params }) {
    try {
        await connectDB();
        const quiz = await Quiz.findById(params.id).lean();
        if (!quiz || !quiz.isPublished) {
            return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
        }
        return NextResponse.json({ quiz });
    }
    catch (error) {
        return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 });
    }
}
