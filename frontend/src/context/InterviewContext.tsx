import { createContext, useContext, useState, type ReactNode } from 'react'

export type InterviewQuestion = {
  question: string
  difficulty: string
  category: string
  expected_answer: string
}

export type Evaluation = {
  score: number
  strengths: string[]
  improvements: string[]
  feedback: string
  ideal_answer: string
}

type InterviewContextValue = {
  questions: InterviewQuestion[]
  setQuestions: (questions: InterviewQuestion[]) => void
}

const InterviewContext = createContext<InterviewContextValue | undefined>(undefined)

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  return <InterviewContext.Provider value={{ questions, setQuestions }}>{children}</InterviewContext.Provider>
}

export function useInterview() {
  const context = useContext(InterviewContext)
  if (!context) throw new Error('useInterview must be used within InterviewProvider')
  return context
}
