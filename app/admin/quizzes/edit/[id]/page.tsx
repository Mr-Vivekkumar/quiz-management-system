"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AdminNav } from "@/components/admin-nav"
import { Button } from "@/components/ui/button"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

interface QuizData {
  _id: string
  title: string
  description: string
  questions: Question[]
  isPublished: boolean
}

export default function EditQuiz() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth")
    if (!auth) {
      router.push("/admin/login")
      return
    }

    fetchQuiz()
  }, [])

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/admin/quizzes/${quizId}`)
      const data = await response.json()
      setQuiz(data.quiz)
      setTitle(data.quiz.title)
      setDescription(data.quiz.description)
      setQuestions(data.quiz.questions)
    } catch (error) {
      console.error("Error fetching quiz:", error)
      setError("Failed to load quiz")
    } finally {
      setLoading(false)
    }
  }

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
  }

  const updateOption = (id: string, index: number, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === id
          ? {
              ...q,
              options: q.options.map((o, i) => (i === index ? value : o)),
            }
          : q,
      ),
    )
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
    }
    setQuestions([...questions, newQuestion])
  }

  const handleSave = async () => {
    setError("")

    if (!title.trim()) {
      setError("Quiz title is required")
      return
    }

    if (questions.length === 0) {
      setError("Add at least one question")
      return
    }

    setSaving(true)

    try {
      const response = await fetch(`/api/admin/quizzes/${quizId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          questions,
        }),
      })

      if (response.ok) {
        router.push("/admin/quizzes")
      } else {
        setError("Failed to save quiz")
      }
    } catch (err) {
      setError("Error saving quiz")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <>
        <AdminNav />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted">Loading quiz...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <AdminNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Edit Quiz</h1>

        <div className="space-y-8">
          {error && <div className="text-error text-sm p-4 bg-error/10 rounded-lg border border-error/20">{error}</div>}

          <div className="bg-input border border-border rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Quiz Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Questions</h2>
              <Button onClick={addQuestion} className="bg-accent hover:bg-accent/80 text-white">
                + Add Question
              </Button>
            </div>

            {questions.map((question, index) => (
              <div key={question.id} className="bg-input border border-border rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">Question {index + 1}</h3>
                  <Button
                    onClick={() => removeQuestion(question.id)}
                    variant="ghost"
                    className="text-error hover:bg-error/10"
                  >
                    Remove
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Question Text *</label>
                  <textarea
                    value={question.question}
                    onChange={(e) => updateQuestion(question.id, "question", e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Options *</label>
                  {question.options.map((option, optIndex) => (
                    <input
                      key={optIndex}
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                      placeholder={`Option ${optIndex + 1}`}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Correct Answer *</label>
                  <select
                    value={question.correctAnswer}
                    onChange={(e) => updateQuestion(question.id, "correctAnswer", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select correct answer</option>
                    {question.options.map((option, i) => (
                      <option key={i} value={option}>
                        {option || `Option ${i + 1}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Explanation</label>
                  <textarea
                    value={question.explanation}
                    onChange={(e) => updateQuestion(question.id, "explanation", e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-primary hover:bg-primary-dark text-white"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button onClick={() => router.back()} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
