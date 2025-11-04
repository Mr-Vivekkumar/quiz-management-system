"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";
export default function AdminResults() {
    const router = useRouter();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const auth = localStorage.getItem("adminAuth");
        if (!auth) {
            router.push("/admin/login");
            return;
        }
        fetchResults();
    }, []);
    const fetchResults = async () => {
        try {
            const response = await fetch("/api/admin/results");
            const data = await response.json();
            setResults(data.results || []);
        }
        catch (error) {
            console.error("Error fetching results:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    const getScoreColor = (score) => {
        if (score >= 80)
            return "text-success";
        if (score >= 60)
            return "text-accent";
        return "text-error";
    };
    return (_jsxs(_Fragment, { children: [_jsx(AdminNav, {}), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Quiz Results" }), loading ? (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-black", children: "Loading results..." }) })) : results.length === 0 ? (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-black", children: "No results yet" }) })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-border", children: [_jsx("th", { className: "text-left py-4 px-4 font-semibold", children: "Quiz" }), _jsx("th", { className: "text-left py-4 px-4 font-semibold", children: "User" }), _jsx("th", { className: "text-left py-4 px-4 font-semibold", children: "Email" }), _jsx("th", { className: "text-right py-4 px-4 font-semibold", children: "Score" }), _jsx("th", { className: "text-right py-4 px-4 font-semibold", children: "Percentage" }), _jsx("th", { className: "text-left py-4 px-4 font-semibold", children: "Completed" })] }) }), _jsx("tbody", { children: results.map((result) => (_jsxs("tr", { className: "border-b border-border hover:bg-input/50 transition", children: [_jsx("td", { className: "py-4 px-4", children: result.quizTitle }), _jsx("td", { className: "py-4 px-4", children: result.userName }), _jsx("td", { className: "py-4 px-4 text-black", children: result.userEmail }), _jsxs("td", { className: `py-4 px-4 text-right font-semibold ${getScoreColor(result.percentageScore)}`, children: [result.score, "/", result.totalQuestions] }), _jsxs("td", { className: `py-4 px-4 text-right font-semibold ${getScoreColor(result.percentageScore)}`, children: [result.percentageScore, "%"] }), _jsx("td", { className: "py-4 px-4 text-black text-xs", children: formatDate(result.completedAt) })] }, result._id))) })] }) }))] })] }));
}
