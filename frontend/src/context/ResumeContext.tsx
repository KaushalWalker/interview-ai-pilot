import { createContext, useContext, useState, type ReactNode } from 'react'

export type ResumeAnalysis = {
  summary: string
  skills: string[]
  projects: string[]
  experience: string[]
  strengths: string[]
  improvement_areas: string[]
}

type ResumeContextValue = {
  analysis: ResumeAnalysis | null
  setAnalysis: (analysis: ResumeAnalysis) => void
}

const ResumeContext = createContext<ResumeContextValue | undefined>(undefined)

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  return <ResumeContext.Provider value={{ analysis, setAnalysis }}>{children}</ResumeContext.Provider>
}

export function useResume() {
  const context = useContext(ResumeContext)
  if (!context) throw new Error('useResume must be used within ResumeProvider')
  return context
}
