"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export function QuizNav() {
    return (_jsx("nav", { className: "bg-input border-b border-border sticky top-0 z-50", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx(Link, { href: "/", className: "text-2xl font-bold text-accent", children: "Quiz Master" }), _jsx(Link, { href: "/", children: _jsx(Button, { variant: "ghost", children: "Back Home" }) })] }) }) }));
}
