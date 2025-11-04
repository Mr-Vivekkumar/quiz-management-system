import { connectDB } from "@/lib/db";
import { Quiz } from "@/lib/models/quiz";
import { NextResponse } from "next/server";
export async function GET(request, { params }) {
    try {
        await connectDB();
        const quiz = await Quiz.findById(params.id);
        if (!quiz) {
            return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
        }
        return NextResponse.json({ quiz });
    }
    catch (error) {
        return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 });
    }
}
export async function PATCH(request, { params }) {
    try {
        await connectDB();
        const body = await request.json();
        const { title, description, questions } = body;
        const quiz = await Quiz.findByIdAndUpdate(params.id, { title, description, questions, updatedAt: new Date() }, { new: true });
        return NextResponse.json({ quiz });
    }
    catch (error) {
        return NextResponse.json({ error: "Failed to update quiz" }, { status: 500 });
    }
}
export async function DELETE(request, { params }) {
    try {
        await connectDB();
        await Quiz.findByIdAndDelete(params.id);
        return NextResponse.json({ message: "Quiz deleted successfully" });
    }
    catch (error) {
        return NextResponse.json({ error: "Failed to delete quiz" }, { status: 500 });
    }
}
