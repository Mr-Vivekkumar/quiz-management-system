"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
export default function EditQuiz() {
    const params = useParams();
    const router = useRouter();
    const quizId = params.id;
    const [quiz, setQuiz] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        const auth = localStorage.getItem("adminAuth");
        if (!auth) {
            router.push("/admin/login");
            return;
        }
        fetchQuiz();
    }, []);
    const fetchQuiz = async () => {
        try {
            const response = await fetch(`/api/admin/quizzes/${quizId}`);
            const data = await response.json();
            setQuiz(data.quiz);
            setTitle(data.quiz.title);
            setDescription(data.quiz.description);
            setQuestions(data.quiz.questions);
        }
        catch (error) {
            console.error("Error fetching quiz:", error);
            setError("Failed to load quiz");
        }
        finally {
            setLoading(false);
        }
    };
    const updateQuestion = (id, field, value) => {
        setQuestions(questions.map((q) => (q.id === id ? Object.assign(Object.assign({}, q), { [field]: value }) : q)));
    };
    const updateOption = (id, index, value) => {
        setQuestions(questions.map((q) => q.id === id
            ? Object.assign(Object.assign({}, q), { options: q.options.map((o, i) => (i === index ? value : o)) }) : q));
    };
    const removeQuestion = (id) => {
        setQuestions(questions.filter((q) => q.id !== id));
    };
    const addQuestion = () => {
        const newQuestion = {
            id: Date.now().toString(),
            question: "",
            options: ["", "", "", ""],
            correctAnswer: "",
            explanation: "",
        };
        setQuestions([...questions, newQuestion]);
    };
    const handleSave = async () => {
        setError("");
        if (!title.trim()) {
            setError("Quiz title is required");
            return;
        }
        if (questions.length === 0) {
            setError("Add at least one question");
            return;
        }
        setSaving(true);
        try {
            const response = await fetch(`/api/admin/quizzes/${quizId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    questions,
                }),
            });
            if (response.ok) {
                router.push("/admin/quizzes");
            }
            else {
                setError("Failed to save quiz");
            }
        }
        catch (err) {
            setError("Error saving quiz");
        }
        finally {
            setSaving(false);
        }
    };
    if (loading) {
        return (_jsxs(_Fragment, { children: [_jsx(AdminNav, {}), _jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx("p", { className: "text-muted", children: "Loading quiz..." }) })] }));
    }
    return (_jsxs(_Fragment, { children: [_jsx(AdminNav, {}), _jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Edit Quiz" }), _jsxs("div", { className: "space-y-8", children: [error && _jsx("div", { className: "text-error text-sm p-4 bg-error/10 rounded-lg border border-error/20", children: error }), _jsxs("div", { className: "bg-input border border-border rounded-lg p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Quiz Title *" }), _jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), className: "w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Description" }), _jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), rows: 3, className: "w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary" })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Questions" }), _jsx(Button, { onClick: addQuestion, className: "bg-accent hover:bg-accent/80 text-white", children: "+ Add Question" })] }), questions.map((question, index) => (_jsxs("div", { className: "bg-input border border-border rounded-lg p-6 space-y-4", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("h3", { className: "text-lg font-semibold", children: ["Question ", index + 1] }), _jsx(Button, { onClick: () => removeQuestion(question.id), variant: "ghost", className: "text-error hover:bg-error/10", children: "Remove" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Question Text *" }), _jsx("textarea", { value: question.question, onChange: (e) => updateQuestion(question.id, "question", e.target.value), rows: 2, className: "w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-medium", children: "Options *" }), question.options.map((option, optIndex) => (_jsx("input", { type: "text", value: option, onChange: (e) => updateOption(question.id, optIndex, e.target.value), placeholder: `Option ${optIndex + 1}`, className: "w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary" }, optIndex)))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Correct Answer *" }), _jsxs("select", { value: question.correctAnswer, onChange: (e) => updateQuestion(question.id, "correctAnswer", e.target.value), className: "w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary", children: [_jsx("option", { value: "", children: "Select correct answer" }), question.options.map((option, i) => (_jsx("option", { value: option, children: option || `Option ${i + 1}` }, i)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Explanation" }), _jsx("textarea", { value: question.explanation, onChange: (e) => updateQuestion(question.id, "explanation", e.target.value), rows: 2, className: "w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary" })] })] }, question.id)))] }), _jsxs("div", { className: "flex gap-4", children: [_jsx(Button, { onClick: handleSave, disabled: saving, className: "flex-1 bg-primary hover:bg-primary-dark text-white", children: saving ? "Saving..." : "Save Changes" }), _jsx(Button, { onClick: () => router.back(), variant: "outline", className: "flex-1", children: "Cancel" })] })] })] })] }));
}
