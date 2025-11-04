"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function QuizNav() {
  return (
    <nav className="bg-input border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-accent">
            Quiz Master
          </Link>
          <Link href="/">
            <Button variant="ghost">Back Home</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
