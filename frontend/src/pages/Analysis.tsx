import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Loading } from '../components/Loading'
import { generateInterviewQuestions } from '../api/interview'
import { useInterview } from '../context/InterviewContext'
import { useResume } from '../context/ResumeContext'

export function Analysis() {
  const { analysis } = useResume()
  const { setQuestions } = useInterview()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  if (!analysis) return <section className="space-y-4"><h1 className="text-3xl font-bold text-white">Resume Analysis</h1><p className="text-slate-400">Upload a resume to view its analysis.</p><Link to="/resume" className="inline-block rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950">Upload Resume</Link></section>

  const sections = [
    ['Skills', analysis.skills],
    ['Projects', analysis.projects],
    ['Experience', analysis.experience],
    ['Strengths', analysis.strengths],
    ['Improvement Areas', analysis.improvement_areas],
  ] as const

  const handleGenerate = async () => {
    setIsLoading(true)
    try {
      setQuestions(await generateInterviewQuestions(analysis))
      toast.success('Interview questions generated')
      navigate('/interview')
    } catch {
      toast.error('Unable to generate interview questions')
    } finally { setIsLoading(false) }
  }

  return <section className="space-y-8"><div><h1 className="text-3xl font-bold text-white">Resume Analysis</h1><div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6"><h2 className="font-semibold text-cyan-400">Summary</h2><p className="mt-2 text-slate-300">{analysis.summary}</p></div></div><div className="grid gap-5 md:grid-cols-2">{sections.map(([title, items]) => <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900 p-6"><h2 className="font-semibold text-cyan-400">{title}</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">{items.map((item) => <li key={item}>{item}</li>)}</ul></div>)}</div>{isLoading ? <Loading /> : <button onClick={handleGenerate} className="rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950">Generate Interview</button>}</section>
}
