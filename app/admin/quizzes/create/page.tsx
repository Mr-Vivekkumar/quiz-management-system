"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminNav } from "@/components/admin-nav"
import { Button } from "@/components/ui/button"

interface Question {
  id: string
  question: string
  questionType: 'MCQ' | 'True/False' | 'Text'
  options: string[]
  correctAnswer: string
  explanation: string
}

export default function CreateQuiz() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "default-question-1",
      question: "",
      questionType: "MCQ",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
    },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth")
    if (!auth) {
      router.push("/admin/login")
    }
  }, [])

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: "",
      questionType: "MCQ",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
    }
    setQuestions([...questions, newQuestion])
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("Quiz title is required")
      return
    }

    if (questions.length === 0) {
      setError("Add at least one question")
      return
    }

    const invalidQuestions = questions.filter((q) => {
      if (!q.question.trim() || !q.correctAnswer.trim()) {
        return true
      }
      
      if (q.questionType === "MCQ") {
        return q.options.some((o) => !o.trim())
      }
      
      return false
    })

    if (invalidQuestions.length > 0) {
      setError("All questions must have complete information")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/admin/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          questions: questions.map((q) => ({
            id: q.id,
            question: q.question,
            questionType: q.questionType,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
          })),
        }),
      })

      if (response.ok) {
        router.push("/admin/quizzes")
      } else {
        setError("Failed to create quiz")
      }
    } catch (err) {
      setError("Error creating quiz")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AdminNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Create New Quiz</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && <div className="text-error text-sm p-4 bg-error/10 rounded-lg border border-error/20">{error}</div>}

          <div className="bg-input border border-border rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Quiz Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter quiz title"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter quiz description"
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Questions</h2>
              <Button type="button" onClick={addQuestion} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded">
                + Add Question
              </Button>
            </div>

            {questions.map((question, index) => (
              <div key={question.id} className="bg-input border border-border rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">Question {index + 1}</h3>
                  <Button
                    type="button"
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
                    placeholder="Enter question"
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Question Type *</label>
                  <select
                    value={question.questionType}
                    onChange={(e) =>
                      updateQuestion(question.id, "questionType", e.target.value as Question["questionType"])
                    }
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="MCQ">Multiple Choice</option>
                    <option value="True/False">True/False</option>
                    <option value="Text">Text</option>
                  </select>
                </div>

                {question.questionType === "MCQ" && (
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
                )}

                {question.questionType === "True/False" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Correct Answer *</label>
                    <select
                      value={question.correctAnswer}
                      onChange={(e) => updateQuestion(question.id, "correctAnswer", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select correct answer</option>
                      <option value="True">True</option>
                      <option value="False">False</option>
                    </select>
                  </div>
                )}

                {question.questionType === "Text" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Correct Answer *</label>
                    <input
                      type="text"
                      value={question.correctAnswer}
                      onChange={(e) => updateQuestion(question.id, "correctAnswer", e.target.value)}
                      placeholder="Enter correct answer"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                )}

                {question.questionType === "MCQ" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Correct Answer *</label>
                    <select
                      value={question.correctAnswer}
                      onChange={(e) => updateQuestion(question.id, "correctAnswer", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select correct answer</option>
                      {question.options.map(
                        (option, optIndex) =>
                          option && (
                            <option key={optIndex} value={option}>
                              {option}
                            </option>
                          ),
                      )}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Explanation</label>
                  <textarea
                    value={question.explanation}
                    onChange={(e) => updateQuestion(question.id, "explanation", e.target.value)}
                    placeholder="Explain the correct answer"
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary-dark text-white">
              {loading ? "Creating..." : "Create Quiz"}
            </Button>
            <Button type="button" onClick={() => router.back()} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
