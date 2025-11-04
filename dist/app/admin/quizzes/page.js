"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function AdminQuizzes() {
    const router = useRouter();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const auth = localStorage.getItem("adminAuth");
        if (!auth) {
            router.push("/admin/login");
            return;
        }
        fetchQuizzes();
    }, []);
    const fetchQuizzes = async () => {
        try {
            const response = await fetch("/api/admin/quizzes");
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
    const deleteQuiz = async (id) => {
        if (!confirm("Are you sure you want to delete this quiz?"))
            return;
        try {
            await fetch(`/api/admin/quizzes/${id}`, { method: "DELETE" });
            fetchQuizzes();
        }
        catch (error) {
            console.error("Error deleting quiz:", error);
        }
    };
    const togglePublish = async (id, currentStatus) => {
        try {
            await fetch(`/api/admin/quizzes/${id}/publish`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPublished: !currentStatus }),
            });
            fetchQuizzes();
        }
        catch (error) {
            console.error("Error updating quiz:", error);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(AdminNav, {}), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold", children: "My Quizzes" }), _jsx(Link, { href: "/admin/quizzes/create", children: _jsx(Button, { className: "bg-primary hover:bg-primary-dark text-white", children: "Create New Quiz" }) })] }), loading ? (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-black", children: "Loading quizzes..." }) })) : quizzes.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("p", { className: "text-black mb-4", children: "No quizzes created yet" }), _jsx(Link, { href: "/admin/quizzes/create", children: _jsx(Button, { className: "bg-accent hover:bg-accent/80", children: "Create Your First Quiz" }) })] })) : (_jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: quizzes.map((quiz) => (_jsxs("div", { className: "bg-input border border-border rounded-lg p-6 hover:border-primary transition", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: quiz.title }), _jsx("p", { className: "text-sm text-black mb-4", children: quiz.description }), _jsxs("div", { className: "flex justify-between items-center text-xs text-black mb-4", children: [_jsxs("span", { children: [quiz.questionCount, " questions"] }), _jsx("span", { className: `px-2 py-1 rounded ${quiz.isPublished ? "bg-success/20 text-success" : "bg-error/20 text-error"}`, children: quiz.isPublished ? "Published" : "Draft" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Link, { href: `/admin/quizzes/edit/${quiz._id}`, children: _jsx(Button, { size: "sm", variant: "outline", className: "flex-1 bg-transparent", children: "Edit" }) }), _jsx(Button, { size: "sm", onClick: () => togglePublish(quiz._id, quiz.isPublished), className: "flex-1", variant: quiz.isPublished ? "default" : "ghost", children: quiz.isPublished ? "Unpublish" : "Publish" }), _jsx(Button, { size: "sm", variant: "ghost", className: "text-error hover:bg-error/10 flex-1", onClick: () => deleteQuiz(quiz._id), children: "Delete" })] })] }, quiz._id))) }))] })] }));
}
