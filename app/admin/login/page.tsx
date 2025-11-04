"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminLogin() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem(
          "adminAuth",
          JSON.stringify({ authenticated: true, userId: data.user.id, timestamp: Date.now() }),
        )
        router.push("/admin/quizzes")
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err) {
      setError("Connection error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary-dark/10">
      <div className="w-full max-w-md p-8 bg-input border border-border rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-accent mb-8">Admin Login</h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {error && <div className="text-error text-sm p-3 bg-error/10 rounded-lg">{error}</div>}

          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Demo credentials:
          <br />
          <span className="font-mono bg-background px-2 py-1 rounded">admin / admin123</span>
        </p>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="ghost">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
