import { apiClient } from './axios'
import type { ResumeAnalysis } from '../context/ResumeContext'
import type { Evaluation, InterviewQuestion } from '../context/InterviewContext'

export async function generateInterviewQuestions(analysis: ResumeAnalysis) {
  const { data } = await apiClient.post<{ questions: InterviewQuestion[] }>('/interview/questions', analysis)
  return data.questions
}

export async function evaluateInterviewAnswer(payload: {
  question: string
  expected_answer: string
  candidate_answer: string
}) {
  const { data } = await apiClient.post<Evaluation>('/interview/evaluate', payload)
  return data
}
