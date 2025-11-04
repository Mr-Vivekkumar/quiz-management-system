"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { QuizNav } from "@/components/quiz-nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function QuizzesPage() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchPublishedQuizzes();
    }, []);
    const fetchPublishedQuizzes = async () => {
        try {
            const response = await fetch("/api/quizzes");
            const data = await response.json();
            setQuizzes(data.quizzes || []);
        }
        catch (error) {
            console.error("Error fetching quizzes:", error);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(QuizNav, {}), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("h1", { className: "text-3xl font-bold mb-2", children: "Available Quizzes" }), _jsx("p", { className: "text-black mb-8", children: "Choose a quiz to get started" }), loading ? (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-black", children: "Loading quizzes..." }) })) : quizzes.length === 0 ? (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-black", children: "No quizzes available yet" }) })) : (_jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: quizzes.map((quiz) => (_jsxs("div", { className: "bg-input border border-border rounded-lg p-6 hover:border-primary transition", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: quiz.title }), _jsx("p", { className: "text-sm text-black mb-4", children: quiz.description }), _jsxs("p", { className: "text-xs text-black mb-6", children: [quiz.questionCount, " questions"] }), _jsx(Link, { href: `/quiz/${quiz._id}`, children: _jsx(Button, { className: "w-full bg-primary hover:bg-primary-dark text-white", children: "Start Quiz" }) })] }, quiz._id))) }))] })] }));
}
