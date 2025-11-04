"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminNav } from "@/components/admin-nav"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Quiz {
  _id: string
  title: string
  description: string
  questionCount: number
  isPublished: boolean
  createdAt: string
}

export default function AdminQuizzes() {
  const router = useRouter()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth")
    if (!auth) {
      router.push("/admin/login")
      return
    }

    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("/api/admin/quizzes")
      const data = await response.json()
      setQuizzes(data.quizzes || [])
    } catch (error) {
      console.error("Error fetching quizzes:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteQuiz = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return

    try {
      await fetch(`/api/admin/quizzes/${id}`, { method: "DELETE" })
      fetchQuizzes()
    } catch (error) {
      console.error("Error deleting quiz:", error)
    }
  }

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/admin/quizzes/${id}/publish`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !currentStatus }),
      })
      fetchQuizzes()
    } catch (error) {
      console.error("Error updating quiz:", error)
    }
  }

  return (
    <>
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Quizzes</h1>
          <Link href="/admin/quizzes/create">
            <Button className="bg-primary hover:bg-primary-dark text-white">Create New Quiz</Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted">Loading quizzes...</p>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted mb-4">No quizzes created yet</p>
            <Link href="/admin/quizzes/create">
              <Button className="bg-accent hover:bg-accent/80">Create Your First Quiz</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-input border border-border rounded-lg p-6 hover:border-primary transition"
              >
                <h3 className="text-lg font-semibold mb-2">{quiz.title}</h3>
                <p className="text-sm text-muted mb-4">{quiz.description}</p>
                <div className="flex justify-between items-center text-xs text-muted mb-4">
                  <span>{quiz.questionCount} questions</span>
                  <span
                    className={`px-2 py-1 rounded ${
                      quiz.isPublished ? "bg-success/20 text-success" : "bg-error/20 text-error"
                    }`}
                  >
                    {quiz.isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link href={`/admin/quizzes/edit/${quiz._id}`}>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    onClick={() => togglePublish(quiz._id, quiz.isPublished)}
                    className="flex-1"
                    variant={quiz.isPublished ? "default" : "ghost"}
                  >
                    {quiz.isPublished ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-error hover:bg-error/10 flex-1"
                    onClick={() => deleteQuiz(quiz._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
