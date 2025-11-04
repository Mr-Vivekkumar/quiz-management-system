"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function AdminLogin() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("adminAuth", JSON.stringify({ authenticated: true, userId: data.user.id, timestamp: Date.now() }));
                router.push("/admin/quizzes");
            }
            else {
                setError(data.error || "Login failed");
            }
        }
        catch (err) {
            setError("Connection error. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary-dark/10", children: _jsxs("div", { className: "w-full max-w-md p-8 bg-input border border-border rounded-lg shadow-lg", children: [_jsx("h1", { className: "text-3xl font-bold text-center text-accent mb-8", children: "Admin Login" }), _jsxs("form", { onSubmit: handleLogin, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Username" }), _jsx("input", { type: "text", value: username, onChange: (e) => setUsername(e.target.value), placeholder: "Enter username", className: "w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Enter password", className: "w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary" })] }), error && _jsx("div", { className: "text-error text-sm p-3 bg-error/10 rounded-lg", children: error }), _jsx(Button, { type: "submit", disabled: loading, className: "w-full bg-primary hover:bg-primary-dark text-white", children: loading ? "Logging in..." : "Login" })] }), _jsxs("p", { className: "text-center text-sm text-muted mt-6", children: ["Demo credentials:", _jsx("br", {}), _jsx("span", { className: "font-mono bg-background px-2 py-1 rounded", children: "admin / admin123" })] }), _jsx("div", { className: "mt-8 text-center", children: _jsx(Link, { href: "/", children: _jsx(Button, { variant: "ghost", children: "Back to Home" }) }) })] }) }));
}
