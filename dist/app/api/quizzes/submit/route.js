import { connectDB } from "@/lib/db";
import { Response as QuizResponse } from "@/lib/models/response";
import { NextResponse } from "next/server";
export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const { quizId, userName, userEmail, answers, score, totalQuestions, percentageScore } = body;
        const response = new QuizResponse({
            quizId,
            userId: `${userEmail}-${Date.now()}`,
            userEmail,
            userName,
            answers,
            score,
            totalQuestions,
            percentageScore,
            completedAt: new Date(),
        });
        await response.save();
        return NextResponse.json({ response, message: "Quiz submitted successfully" }, { status: 201 });
    }
    catch (error) {
        return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 });
    }
}
