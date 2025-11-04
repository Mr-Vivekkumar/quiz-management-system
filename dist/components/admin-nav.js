"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
export function AdminNav() {
    const pathname = usePathname();
    const isActive = (path) => pathname === path;
    return (_jsx("nav", { className: "bg-input border-b border-border sticky top-0 z-50", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx(Link, { href: "/admin", className: "text-2xl font-bold text-accent", children: "Quiz Admin" }), _jsxs("div", { className: "flex gap-4", children: [_jsx(Link, { href: "/admin/quizzes", children: _jsx(Button, { variant: isActive("/admin/quizzes") ? "default" : "ghost", className: isActive("/admin/quizzes") ? "bg-primary text-white" : "", children: "My Quizzes" }) }), _jsx(Link, { href: "/admin/results", children: _jsx(Button, { variant: isActive("/admin/results") ? "default" : "ghost", className: isActive("/admin/results") ? "bg-primary text-white" : "", children: "Results" }) }), _jsx(Button, { onClick: () => {
                                    localStorage.removeItem("adminAuth");
                                    window.location.href = "/admin/login";
                                }, variant: "ghost", className: "text-error hover:bg-error/10", children: "Logout" })] })] }) }) }));
}
