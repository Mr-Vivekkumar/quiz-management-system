"use client"

import Link from "next/link"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { QuizNav } from "@/components/quiz-nav"
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
}

export default function TakeQuizPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [quizStarted, setQuizStarted] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetchQuiz()
  }, [quizId])

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}`)
      const data = await response.json()
      setQuiz(data.quiz)
    } catch (error) {
      console.error("Error fetching quiz:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartQuiz = () => {
    if (!userName.trim() || !userEmail.trim()) {
      alert("Please enter your name and email")
      return
    }
    setQuizStarted(true)
  }

  const handleSelectAnswer = (answer: string) => {
    if (!submitted) {
      setAnswers({
        ...answers,
        [quiz!.questions[currentQuestion].id]: answer,
      })
    }
  }

  const handleNext = () => {
    if (currentQuestion < quiz!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    if (!confirm("Are you sure you want to submit your quiz?")) return

    const userAnswers = quiz!.questions.map((q) => ({
      questionId: q.id,
      selectedAnswer: answers[q.id] || "",
      isCorrect: answers[q.id] === q.correctAnswer,
    }))

    const correctCount = userAnswers.filter((a) => a.isCorrect).length
    const percentageScore = Math.round((correctCount / quiz!.questions.length) * 100)

    try {
      const response = await fetch("/api/quizzes/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId,
          userName,
          userEmail,
          answers: userAnswers,
          score: correctCount,
          totalQuestions: quiz!.questions.length,
          percentageScore,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
      }
    } catch (error) {
      console.error("Error submitting quiz:", error)
      alert("Error submitting quiz")
    }
  }

  if (loading) {
    return (
      <>
        <QuizNav />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted">Loading quiz...</p>
        </div>
      </>
    )
  }

  if (!quiz) {
    return (
      <>
        <QuizNav />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-error">Quiz not found</p>
        </div>
      </>
    )
  }

  if (!quizStarted) {
    return (
      <>
        <QuizNav />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-input border border-border rounded-lg p-8 space-y-6">
            <h1 className="text-3xl font-bold">{quiz.title}</h1>
            <p className="text-muted">{quiz.description}</p>

            <div className="bg-background p-4 rounded-lg border border-border">
              <p className="text-sm">
                <span className="font-semibold">{quiz.questions.length}</span> questions
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Name *</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Email *</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <Button onClick={handleStartQuiz} className="w-full bg-primary hover:bg-primary-dark text-white">
              Start Quiz
            </Button>

            <Link href="/quiz">
              <Button variant="ghost" className="w-full">
                Back to Quizzes
              </Button>
            </Link>
          </div>
        </div>
      </>
    )
  }

  if (submitted) {
    const correctCount = Object.values(answers).filter(
      (answer, index) => answer === quiz.questions[index].correctAnswer,
    ).length
    const percentageScore = Math.round((correctCount / quiz.questions.length) * 100)

    return (
      <>
        <QuizNav />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-input border border-border rounded-lg p-8 text-center space-y-6">
            <h1 className="text-3xl font-bold">Quiz Submitted!</h1>

            <div className="bg-background p-6 rounded-lg border border-border">
              <p className="text-sm text-muted mb-2">Your Score</p>
              <p
                className={`text-4xl font-bold ${percentageScore >= 80 ? "text-success" : percentageScore >= 60 ? "text-accent" : "text-error"}`}
              >
                {percentageScore}%
              </p>
              <p className="text-muted mt-2">
                {correctCount} out of {quiz.questions.length} correct
              </p>
            </div>

            <Link href="/quiz">
              <Button className="w-full bg-primary hover:bg-primary-dark text-white">Back to Quizzes</Button>
            </Link>
          </div>
        </div>
      </>
    )
  }

  const question = quiz.questions[currentQuestion]
  const selectedAnswer = answers[question.id]

  return (
    <>
      <QuizNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
            <span className="text-muted">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
          </div>

          <div className="w-full bg-border rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{
                width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="bg-input border border-border rounded-lg p-8 space-y-6">
          <h2 className="text-xl font-semibold">{question.question}</h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(option)}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  selectedAnswer === option ? "border-primary bg-primary/10" : "border-border hover:border-primary"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedAnswer === option ? "border-primary bg-primary" : "border-muted"
                    }`}
                  >
                    {selectedAnswer === option && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <Button onClick={handlePrevious} disabled={currentQuestion === 0} variant="outline">
            Previous
          </Button>

          <div className="flex-1" />

          {currentQuestion === quiz.questions.length - 1 ? (
            <Button onClick={handleSubmit} className="bg-success hover:bg-success/80 text-white">
              Submit Quiz
            </Button>
          ) : (
            <Button onClick={handleNext} className="bg-primary hover:bg-primary-dark text-white">
              Next
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
