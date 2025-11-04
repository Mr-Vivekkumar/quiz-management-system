"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export function AdminNav() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-input border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/admin" className="text-2xl font-bold text-accent">
            Quiz Admin
          </Link>

          <div className="flex gap-4">
            <Link href="/admin/quizzes">
              <Button
                variant={isActive("/admin/quizzes") ? "default" : "ghost"}
                className={isActive("/admin/quizzes") ? "bg-primary text-white" : ""}
              >
                My Quizzes
              </Button>
            </Link>
            <Link href="/admin/results">
              <Button
                variant={isActive("/admin/results") ? "default" : "ghost"}
                className={isActive("/admin/results") ? "bg-primary text-white" : ""}
              >
                Results
              </Button>
            </Link>
            <Button
              onClick={() => {
                localStorage.removeItem("adminAuth")
                window.location.href = "/admin/login"
              }}
              variant="ghost"
              className="text-error hover:bg-error/10"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
