import { connectDB } from "@/lib/db";
import { Response as QuizResponse } from "@/lib/models/response";
import { Quiz } from "@/lib/models/quiz";
import { NextResponse } from "next/server";
export async function GET(request) {
    try {
        await connectDB();
        const responses = await QuizResponse.find().lean().sort({ completedAt: -1 });
        const resultsWithQuizTitle = await Promise.all(responses.map(async (response) => {
            const quiz = await Quiz.findById(response.quizId).lean();
            return Object.assign(Object.assign({}, response), { quizTitle: (quiz === null || quiz === void 0 ? void 0 : quiz.title) || "Unknown Quiz" });
        }));
        return NextResponse.json({ results: resultsWithQuizTitle });
    }
    catch (error) {
        return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
    }
}
