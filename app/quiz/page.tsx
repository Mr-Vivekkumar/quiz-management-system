"use client"

import { useEffect, useState } from "react"
import { QuizNav } from "@/components/quiz-nav"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Quiz {
  _id: string
  title: string
  description: string
  questionCount: number
  createdAt: string
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPublishedQuizzes()
  }, [])

  const fetchPublishedQuizzes = async () => {
    try {
      const response = await fetch("/api/quizzes")
      const data = await response.json()
      setQuizzes(data.quizzes || [])
    } catch (error) {
      console.error("Error fetching quizzes:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <QuizNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">Available Quizzes</h1>
        <p className="text-muted mb-8">Choose a quiz to get started</p>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted">Loading quizzes...</p>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted">No quizzes available yet</p>
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
                <p className="text-xs text-muted mb-6">{quiz.questionCount} questions</p>

                <Link href={`/quiz/${quiz._id}`}>
                  <Button className="w-full bg-primary hover:bg-primary-dark text-white">Start Quiz</Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
