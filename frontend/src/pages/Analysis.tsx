import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Loading } from '../components/Loading'
import { generateInterviewQuestions } from '../api/interview'
import { useInterview } from '../context/InterviewContext'
import { useResume } from '../context/ResumeContext'

type IconProps = { className?: string }

function SparklesIcon({ className }: IconProps) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m9.813 15.904-2.29 6.086-1.1-4.074-4.074-1.1 6.086-2.29 1.378-3.667 1.378 3.667 6.086 2.29-4.074 1.1-1.1 4.074-2.29-6.086Zm6.75-8.25L18 3.75l1.438 3.904L23.25 9l-3.812 1.346L18 14.25l-1.438-3.904L12.75 9l3.813-1.346Z" /></svg> }
function CodeIcon({ className }: IconProps) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 9-3 3 3 3m7.5-6 3 3-3 3M14.25 6l-4.5 12" /></svg> }
function FolderIcon({ className }: IconProps) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V6.75A2.25 2.25 0 0 1 4.5 4.5h4.086a2.25 2.25 0 0 1 1.591.659l1.5 1.5a2.25 2.25 0 0 0 1.591.659H19.5a2.25 2.25 0 0 1 2.25 2.25v3.182M2.25 12.75h19.5m-19.5 0-1.03 5.15A2.25 2.25 0 0 0 3.428 20.625h17.144a2.25 2.25 0 0 0 2.208-1.808l1.03-5.15" /></svg> }
function BriefcaseIcon({ className }: IconProps) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.1a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25v-4.1m16.5 0V9.75A2.25 2.25 0 0 0 18 7.5h-2.25V6A2.25 2.25 0 0 0 13.5 3.75h-3A2.25 2.25 0 0 0 8.25 6v1.5H6a2.25 2.25 0 0 0-2.25 2.25v4.4m16.5 0a18.66 18.66 0 0 1-8.25 1.9 18.66 18.66 0 0 1-8.25-1.9m8.25-2.4v.01" /></svg> }
function BoltIcon({ className }: IconProps) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m13.5 3-9 10.5h6l-1.5 7.5 9-10.5h-6L13.5 3Z" /></svg> }
function ArrowUpIcon({ className }: IconProps) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6-6 6 6m-6-6v13.5m4.5-3.75 3 3 3-3" /></svg> }

const sectionStyles = [
  { title: 'Skills', key: 'skills', icon: CodeIcon, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  { title: 'Projects', key: 'projects', icon: FolderIcon, color: 'text-violet-400', bg: 'bg-violet-400/10' },
  { title: 'Experience', key: 'experience', icon: BriefcaseIcon, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { title: 'Strengths', key: 'strengths', icon: BoltIcon, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { title: 'Improvement Areas', key: 'improvement_areas', icon: ArrowUpIcon, color: 'text-amber-400', bg: 'bg-amber-400/10' },
] as const

export function Analysis() {
  const { analysis } = useResume()
  const { setQuestions } = useInterview()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  if (!analysis) return <section className="space-y-4"><h1 className="text-3xl font-bold text-white">Resume Analysis</h1><p className="text-slate-400">Upload a resume to view its analysis.</p><Link to="/resume" className="inline-block rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950">Upload Resume</Link></section>

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

  return <section className="space-y-8"><div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 px-6 py-9 sm:px-10"><div className="absolute -right-24 -top-32 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" /><div className="relative max-w-3xl"><div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-cyan-400"><SparklesIcon className="h-5 w-5" />AI-powered insights</div><h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Resume Analysis</h1><p className="mt-5 text-base leading-7 text-slate-300">{analysis.summary}</p></div></div><div className="grid gap-5 md:grid-cols-2">{sectionStyles.map(({ title, key, icon: Icon, color, bg }) => <article key={title} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition duration-200 hover:-translate-y-1 hover:border-slate-700"><div className="flex items-center gap-3"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${color}`}><Icon className="h-5 w-5" /></div><h2 className="text-lg font-semibold text-white">{title}</h2></div><div className="mt-5 flex flex-wrap gap-2">{analysis[key].map((item) => <span key={item} className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm leading-5 text-slate-300">{item}</span>)}</div></article>)}</div><div className="flex justify-center pt-2">{isLoading ? <Loading /> : <button onClick={handleGenerate} className="inline-flex items-center rounded-lg bg-cyan-500 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950">Start Mock Interview <span className="ml-2" aria-hidden="true">→</span></button>}</div></section>
}
