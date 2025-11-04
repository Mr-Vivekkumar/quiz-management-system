"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QuizNav } from "@/components/quiz-nav";
import { Button } from "@/components/ui/button";
export default function TakeQuizPage() {
    const params = useParams();
    const router = useRouter();
    const quizId = params.id;
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [quizStarted, setQuizStarted] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    useEffect(() => {
        fetchQuiz();
    }, [quizId]);
    const fetchQuiz = async () => {
        try {
            const response = await fetch(`/api/quizzes/${quizId}`);
            const data = await response.json();
            setQuiz(data.quiz);
        }
        catch (error) {
            console.error("Error fetching quiz:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleStartQuiz = () => {
        if (!userName.trim() || !userEmail.trim()) {
            alert("Please enter your name and email");
            return;
        }
        setQuizStarted(true);
    };
    const handleSelectAnswer = (answer) => {
        if (!submitted) {
            setAnswers(Object.assign(Object.assign({}, answers), { [quiz.questions[currentQuestion].id]: answer }));
        }
    };
    const handleNext = () => {
        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };
    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };
    const handleSubmit = async () => {
        if (!confirm("Are you sure you want to submit your quiz?"))
            return;
        const userAnswers = quiz.questions.map((q) => ({
            questionId: q.id,
            selectedAnswer: answers[q.id] || "",
            isCorrect: answers[q.id] === q.correctAnswer,
        }));
        const correctCount = userAnswers.filter((a) => a.isCorrect).length;
        const percentageScore = Math.round((correctCount / quiz.questions.length) * 100);
        try {
            const response = await fetch("/api/quizzes/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    quizId,
                    userName,
                    userEmail,
                    answers: userAnswers,
                    score: correctCount,
                    totalQuestions: quiz.questions.length,
                    percentageScore,
                }),
            });
            if (response.ok) {
                setSubmitted(true);
            }
        }
        catch (error) {
            console.error("Error submitting quiz:", error);
            alert("Error submitting quiz");
        }
    };
    if (loading) {
        return (_jsxs(_Fragment, { children: [_jsx(QuizNav, {}), _jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("p", { className: "text-black", children: "Loading quiz..." }) })] }));
    }
    if (!quiz) {
        return (_jsxs(_Fragment, { children: [_jsx(QuizNav, {}), _jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("p", { className: "text-error", children: "Quiz not found" }) })] }));
    }
    if (!quizStarted) {
        return (_jsxs(_Fragment, { children: [_jsx(QuizNav, {}), _jsx("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs("div", { className: "bg-input border border-border rounded-lg p-8 space-y-6", children: [_jsx("h1", { className: "text-3xl font-bold", children: quiz.title }), _jsx("p", { className: "text-black", children: quiz.description }), _jsx("div", { className: "bg-background p-4 rounded-lg border border-border", children: _jsxs("p", { className: "text-sm", children: [_jsx("span", { className: "font-semibold", children: quiz.questions.length }), " questions"] }) }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Your Name *" }), _jsx("input", { type: "text", value: userName, onChange: (e) => setUserName(e.target.value), placeholder: "Enter your name", className: "w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Your Email *" }), _jsx("input", { type: "email", value: userEmail, onChange: (e) => setUserEmail(e.target.value), placeholder: "Enter your email", className: "w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary" })] })] }), _jsx(Button, { onClick: handleStartQuiz, className: "w-full bg-primary hover:bg-primary-dark text-white", children: "Start Quiz" }), _jsx(Link, { href: "/quiz", children: _jsx(Button, { variant: "ghost", className: "w-full", children: "Back to Quizzes" }) })] }) })] }));
    }
    if (submitted) {
        const correctCount = Object.values(answers).filter((answer, index) => answer === quiz.questions[index].correctAnswer).length;
        const percentageScore = Math.round((correctCount / quiz.questions.length) * 100);
        return (_jsxs(_Fragment, { children: [_jsx(QuizNav, {}), _jsx("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs("div", { className: "bg-input border border-border rounded-lg p-8 text-center space-y-6", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Quiz Submitted!" }), _jsxs("div", { className: "bg-background p-6 rounded-lg border border-border", children: [_jsx("p", { className: "text-sm text-black mb-2", children: "Your Score" }), _jsxs("p", { className: `text-4xl font-bold ${percentageScore >= 80 ? "text-success" : percentageScore >= 60 ? "text-accent" : "text-error"}`, children: [percentageScore, "%"] }), _jsxs("p", { className: "text-black mt-2", children: [correctCount, " out of ", quiz.questions.length, " correct"] })] }), _jsx(Link, { href: "/quiz", children: _jsx(Button, { className: "w-full bg-primary hover:bg-primary-dark text-white", children: "Back to Quizzes" }) })] }) })] }));
    }
    const question = quiz.questions[currentQuestion];
    const selectedAnswer = answers[question.id];
    return (_jsxs(_Fragment, { children: [_jsx(QuizNav, {}), _jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("h1", { className: "text-2xl font-bold", children: quiz.title }), _jsxs("span", { className: "text-black", children: ["Question ", currentQuestion + 1, " of ", quiz.questions.length] })] }), _jsx("div", { className: "w-full bg-border rounded-full h-2", children: _jsx("div", { className: "bg-primary h-2 rounded-full transition-all", style: {
                                        width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
                                    } }) })] }), _jsxs("div", { className: "bg-input border border-border rounded-lg p-8 space-y-6", children: [_jsx("h2", { className: "text-xl font-semibold", children: question.question }), _jsx("div", { className: "space-y-3", children: question.options.map((option, index) => (_jsx("button", { onClick: () => handleSelectAnswer(option), className: `w-full text-left p-4 rounded-lg border-2 transition ${selectedAnswer === option ? "border-primary bg-primary/10" : "border-border hover:border-primary"}`, children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${selectedAnswer === option ? "border-primary bg-primary" : "border-muted"}`, children: selectedAnswer === option && _jsx("div", { className: "w-2 h-2 bg-white rounded-full" }) }), _jsx("span", { children: option })] }) }, index))) })] }), _jsxs("div", { className: "flex gap-4 mt-8", children: [_jsx(Button, { onClick: handlePrevious, disabled: currentQuestion === 0, variant: "outline", children: "Previous" }), _jsx("div", { className: "flex-1" }), currentQuestion === quiz.questions.length - 1 ? (_jsx(Button, { onClick: handleSubmit, className: "bg-success hover:bg-success/80 text-white", children: "Submit Quiz" })) : (_jsx(Button, { onClick: handleNext, className: "bg-primary hover:bg-primary-dark text-white", children: "Next" }))] })] })] }));
}
