"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function AdminPage() {
    const router = useRouter();
    useEffect(() => {
        const auth = localStorage.getItem("adminAuth");
        if (!auth) {
            router.push("/admin/login");
        }
        else {
            router.push("/admin/quizzes");
        }
    }, [router]);
    return null;
}
