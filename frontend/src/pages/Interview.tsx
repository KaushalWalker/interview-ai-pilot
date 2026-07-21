import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

import { evaluateInterviewAnswer } from '../api/interview'
import { useInterview, type Evaluation } from '../context/InterviewContext'

function CheckIcon() { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" /></svg> }
function SparkleIcon() { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m9.813 15.904-2.29 6.086-1.1-4.074-4.074-1.1 6.086-2.29 1.378-3.667 1.378 3.667 6.086 2.29-4.074 1.1-1.1 4.074-2.29-6.086Zm6.75-8.25L18 3.75l1.438 3.904L23.25 9l-3.812 1.346L18 14.25l-1.438-3.904L12.75 9l3.813-1.346Z" /></svg> }

export function Interview() {
  const { questions } = useInterview()

  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  if (!questions.length) return <section className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-8"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400"><SparkleIcon /></div><h1 className="text-3xl font-bold text-white">Interview Practice</h1><p className="text-slate-400">Generate questions from your resume analysis first.</p><Link to="/analysis" className="inline-block rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">View Analysis</Link></section>

  if (isCompleted) return <section className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-cyan-900 bg-slate-900 p-8 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400"><CheckIcon /></div><h1 className="text-4xl font-bold text-white">Interview Completed</h1><p className="text-slate-300">Congratulations! You have completed all interview questions.</p><Link to="/dashboard" className="inline-block rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">Back to Dashboard</Link></section>

  const current = questions[index]
  const progress = Math.round(((index + 1) / questions.length) * 100)

  const handleEvaluate = async () => {
    if (!answer.trim()) return toast.error('Write an answer before evaluating')
    setIsLoading(true)
    try {
      const result = await evaluateInterviewAnswer({ question: current.question, expected_answer: current.expected_answer, candidate_answer: answer })
      setEvaluation(result)
    } catch { toast.error('Unable to evaluate your answer') }
    finally { setIsLoading(false) }
  }

  const handleNext = () => {
    if (index < questions.length - 1) { setIndex(index + 1); setAnswer(''); setEvaluation(null) }
    else { toast.success('Interview completed! 🎉'); setIsCompleted(true) }
  }

  return <section className="mx-auto max-w-4xl space-y-6"><header className="space-y-4"><div className="flex flex-wrap items-end justify-between gap-4"><div><div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-cyan-400"><SparkleIcon />AI interview coach</div><h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Interview Practice</h1></div><div className="text-right"><p className="text-sm text-slate-500">Progress</p><p className="mt-1 text-lg font-semibold text-white">{index + 1} <span className="font-normal text-slate-500">/ {questions.length}</span></p></div></div><div className="flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-cyan-400 transition-all duration-500" style={{ width: `${progress}%` }} /></div><span className="w-12 text-right text-sm font-medium text-cyan-400">{progress}%</span></div></header><article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-slate-950/20 sm:p-9"><div className="flex flex-wrap gap-2"><span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-cyan-300">{current.category}</span><span className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-400">{current.difficulty}</span></div><h2 className="mt-7 max-w-3xl text-2xl font-semibold leading-tight text-white sm:text-3xl">{current.question}</h2><div className="mt-8"><label htmlFor="candidate-answer" className="text-sm font-medium text-slate-300">Your answer</label><textarea id="candidate-answer" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Take your time and explain your thinking..." rows={10} disabled={Boolean(evaluation) || isLoading} className="mt-3 w-full resize-y rounded-xl border border-slate-700 bg-slate-950/70 p-4 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-70" /></div>{!evaluation && <button onClick={handleEvaluate} disabled={isLoading} className="mt-5 flex w-full items-center justify-center rounded-xl bg-cyan-500 px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60">{isLoading ? <><span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />Evaluating your answer...</> : 'Evaluate Answer'}</button>}</article>{evaluation && <EvaluationCard evaluation={evaluation} onNext={handleNext} isFinal={index === questions.length - 1} />}</section>
}

function EvaluationCard({ evaluation, onNext, isFinal }: { evaluation: Evaluation; onNext: () => void; isFinal: boolean }) {
  const scoreStyle = { background: `conic-gradient(#22d3ee ${evaluation.overall_score * 3.6}deg, #1e293b 0deg)` }
  const dimensions = [['Technical accuracy', evaluation.technical_accuracy], ['Communication', evaluation.communication], ['Problem solving', evaluation.problem_solving], ['Confidence', evaluation.confidence]] as const
  return <section className="space-y-7 rounded-2xl border border-cyan-900/70 bg-slate-900 p-6 sm:p-9"><div className="flex flex-col gap-6 sm:flex-row sm:items-center"><div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full p-2" style={scoreStyle}><div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-slate-900"><span className="text-3xl font-bold text-white">{evaluation.overall_score}</span><span className="text-xs text-slate-500">/ 100</span></div></div><div><p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-400">AI evaluation</p><div className="mt-2 flex flex-wrap items-center gap-3"><h2 className="text-2xl font-semibold text-white">Senior interviewer review</h2><span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">{evaluation.hire_recommendation}</span></div><p className="mt-2 text-slate-400">A structured assessment of your technical and communication performance.</p></div></div><div className="grid gap-4 sm:grid-cols-2">{dimensions.map(([label, value]) => <div key={label}><div className="mb-2 flex justify-between text-sm"><span className="text-slate-400">{label}</span><span className="font-semibold text-white">{value}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${value}%` }} /></div></div>)}</div><div className="grid gap-6 sm:grid-cols-2"><ResultList title="Strengths" items={evaluation.strengths} tone="text-emerald-400" /><ResultList title="Improvements" items={evaluation.improvements} tone="text-amber-400" /><ResultList title="Missed Points" items={evaluation.missed_points} tone="text-rose-400" /></div><div className="grid gap-5 border-t border-slate-800 pt-6 sm:grid-cols-2"><div><h3 className="font-semibold text-cyan-400">Feedback</h3><p className="mt-2 leading-7 text-slate-300">{evaluation.feedback}</p></div><div><h3 className="font-semibold text-cyan-400">Ideal Answer</h3><p className="mt-2 leading-7 text-slate-300">{evaluation.ideal_answer}</p></div><div><h3 className="font-semibold text-cyan-400">Interviewer Notes</h3><p className="mt-2 leading-7 text-slate-300">{evaluation.interviewer_notes}</p></div><div><h3 className="font-semibold text-cyan-400">Follow-up Question</h3><p className="mt-2 leading-7 text-slate-300">{evaluation.follow_up_question}</p></div></div><button onClick={onNext} className="w-full rounded-xl border border-slate-700 px-5 py-3.5 text-sm font-semibold text-white transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300">{isFinal ? 'Finish Interview' : 'Next Question'} <span className="ml-2" aria-hidden="true">→</span></button></section>
}

function ResultList({ title, items, tone }: { title: string; items: string[]; tone: string }) { return <div><h3 className={`font-semibold ${tone}`}>{title}</h3><ul className="mt-3 space-y-2">{items.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-slate-300"><span className={`mt-1 ${tone}`}><CheckIcon /></span><span>{item}</span></li>)}</ul></div> }
