import { apiClient } from './axios'
import type { ResumeAnalysis } from '../context/ResumeContext'

type ResumeUploadResponse = { filename: string; pages: number; text: string }

export async function uploadResume(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await apiClient.post<ResumeUploadResponse>('/resume/upload', formData)
  return data
}

export async function analyzeResume(resumeText: string) {
  const { data } = await apiClient.post<ResumeAnalysis>('/resume/analyze', {
    resume_text: resumeText,
  })
  return data
}
