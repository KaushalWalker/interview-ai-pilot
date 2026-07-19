import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

import { Loading } from '../components/Loading'
import { evaluateInterviewAnswer } from '../api/interview'
import { useInterview, type Evaluation } from '../context/InterviewContext'

export function Interview() {
  const { questions } = useInterview()

  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  if (!questions.length) {
    return (
      <section className="space-y-4">
        <h1 className="text-3xl font-bold text-white">
          Interview Practice
        </h1>

        <p className="text-slate-400">
          Generate questions from your resume analysis first.
        </p>

        <Link
          to="/analysis"
          className="inline-block rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950"
        >
          View Analysis
        </Link>
      </section>
    )
  }

  if (isCompleted) {
    return (
      <section className="mx-auto max-w-2xl rounded-2xl border border-cyan-900 bg-slate-900 p-8 text-center space-y-6">
        <h1 className="text-4xl font-bold text-white">
          🎉 Interview Completed
        </h1>

        <p className="text-slate-300">
          Congratulations! You have completed all interview questions.
        </p>

        <Link
          to="/dashboard"
          className="inline-block rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950"
        >
          Back to Dashboard
        </Link>
      </section>
    )
  }

  const current = questions[index]

  const handleEvaluate = async () => {
    if (!answer.trim()) {
      return toast.error('Write an answer before evaluating')
    }

    setIsLoading(true)

    try {
      const result = await evaluateInterviewAnswer({
        question: current.question,
        expected_answer: current.expected_answer,
        candidate_answer: answer,
      })

      setEvaluation(result)
    } catch {
      toast.error('Unable to evaluate your answer')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    if (index < questions.length - 1) {
      setIndex(index + 1)
      setAnswer('')
      setEvaluation(null)
    } else {
      toast.success('Interview completed! 🎉')
      setIsCompleted(true)
    }
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-white">
          Interview Practice
        </h1>

        <p className="mt-2 text-slate-400">
          Question {index + 1} of {questions.length}
        </p>
      </div>

      <div className="h-2 w-full rounded-full bg-slate-800">
        <div
          className="h-2 rounded-full bg-cyan-500 transition-all"
          style={{
            width: `${((index + 1) / questions.length) * 100}%`,
          }}
        />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <div className="flex gap-3 text-xs uppercase tracking-wide text-cyan-400">
          <span>{current.category}</span>
          <span>•</span>
          <span>{current.difficulty}</span>
        </div>

        <h2 className="mt-4 text-xl font-semibold text-white">
          {current.question}
        </h2>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer..."
          rows={7}
          className="mt-6 w-full rounded-lg bg-slate-800 p-4 text-slate-100 outline-none ring-cyan-500 focus:ring-2"
        />

        <div className="mt-5 flex gap-3">

          {!evaluation && !isLoading && (
            <button
              onClick={handleEvaluate}
              className="rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950"
            >
              Evaluate
            </button>
          )}

          {isLoading && <Loading />}

          {evaluation && (
            <button
              onClick={handleNext}
              className="rounded-lg border border-slate-600 px-5 py-3 text-white hover:bg-slate-800"
            >
              {index === questions.length - 1
                ? 'Finish Interview'
                : 'Next Question'}
            </button>
          )}

        </div>

      </div>

      {evaluation && (
        <div className="space-y-5 rounded-2xl border border-cyan-900 bg-slate-900 p-6">

          <h2 className="text-2xl font-bold text-white">
            Score: {evaluation.score}/100
          </h2>

          <ResultList
            title="Strengths"
            items={evaluation.strengths}
          />

          <ResultList
            title="Improvements"
            items={evaluation.improvements}
          />

          <div>
            <h3 className="font-semibold text-cyan-400">
              Feedback
            </h3>

            <p className="mt-2 text-slate-300">
              {evaluation.feedback}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-cyan-400">
              Ideal Answer
            </h3>

            <p className="mt-2 text-slate-300">
              {evaluation.ideal_answer}
            </p>
          </div>

        </div>
      )}

    </section>
  )
}

function ResultList({
  title,
  items,
}: {
  title: string
  items: string[]
}) {
  return (
    <div>
      <h3 className="font-semibold text-cyan-400">
        {title}
      </h3>

      <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}