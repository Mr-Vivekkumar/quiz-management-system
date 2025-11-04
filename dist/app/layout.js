import { jsx as _jsx } from "react/jsx-runtime";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
const geistSans = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });
export const metadata = {
    title: "Quiz Management System",
    description: "Create and take quizzes with ease",
};
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "en", children: _jsx("body", { className: `${geistSans.className}`, children: _jsx("div", { className: "min-h-screen bg-background text-foreground", children: children }) }) }));
}
