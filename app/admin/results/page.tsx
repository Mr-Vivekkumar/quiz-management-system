"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminNav } from "@/components/admin-nav"

interface Result {
  _id: string
  quizTitle: string
  userName: string
  userEmail: string
  score: number
  totalQuestions: number
  percentageScore: number
  completedAt: string
}

export default function AdminResults() {
  const router = useRouter()
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth")
    if (!auth) {
      router.push("/admin/login")
      return
    }

    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      const response = await fetch("/api/admin/results")
      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error("Error fetching results:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success"
    if (score >= 60) return "text-accent"
    return "text-error"
  }

  return (
    <>
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Quiz Results</h1>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted">Loading results...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted">No results yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold">Quiz</th>
                  <th className="text-left py-4 px-4 font-semibold">User</th>
                  <th className="text-left py-4 px-4 font-semibold">Email</th>
                  <th className="text-right py-4 px-4 font-semibold">Score</th>
                  <th className="text-right py-4 px-4 font-semibold">Percentage</th>
                  <th className="text-left py-4 px-4 font-semibold">Completed</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result._id} className="border-b border-border hover:bg-input/50 transition">
                    <td className="py-4 px-4">{result.quizTitle}</td>
                    <td className="py-4 px-4">{result.userName}</td>
                    <td className="py-4 px-4 text-muted">{result.userEmail}</td>
                    <td className={`py-4 px-4 text-right font-semibold ${getScoreColor(result.percentageScore)}`}>
                      {result.score}/{result.totalQuestions}
                    </td>
                    <td className={`py-4 px-4 text-right font-semibold ${getScoreColor(result.percentageScore)}`}>
                      {result.percentageScore}%
                    </td>
                    <td className="py-4 px-4 text-muted text-xs">{formatDate(result.completedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
