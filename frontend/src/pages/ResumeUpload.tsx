import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Loading } from '../components/Loading'
import { analyzeResume, uploadResume } from '../api/resume'
import { useResume } from '../context/ResumeContext'

function UploadIcon() {
  return <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v1.875A2.625 2.625 0 0 0 5.625 21h12.75A2.625 2.625 0 0 0 21 18.375V16.5m-9-12v12m0-12 3.75 3.75M12 4.5 8.25 8.25" /></svg>
}

function PdfIcon() {
  return <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-9a1.5 1.5 0 0 0-1.5-1.5h-9a1.5 1.5 0 0 0-1.5 1.5v13.5a1.5 1.5 0 0 0 1.5 1.5h6.75m3.75-6 3 3m0 0-3 3m3-3h-6" /></svg>
}

export function ResumeUpload() {
  const navigate = useNavigate()
  const { setAnalysis } = useResume()
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async () => {
    if (!file) return toast.error('Select a PDF first')
    setIsLoading(true)
    try {
      const uploaded = await uploadResume(file)
      const analysis = await analyzeResume(uploaded.text)
      setAnalysis(analysis)
      toast.success('Resume analyzed successfully')
      navigate('/analysis')
    } catch {
      toast.error('Unable to upload or analyze resume')
    } finally {
      setIsLoading(false)
    }
  }

  const chooseFile = (selectedFile: File | undefined) => {
    if (selectedFile) setFile(selectedFile)
  }

  return (
    <section className="mx-auto max-w-3xl space-y-8">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">Resume workspace</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Upload your Resume</h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-400">Start with your resume and let InterviewPilot turn your experience into a focused preparation plan.</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-2xl shadow-slate-950/30 sm:p-6">
        <div
          onDragOver={(event) => { event.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => { event.preventDefault(); setIsDragging(false); chooseFile(event.dataTransfer.files[0]) }}
          className={`flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center transition ${isDragging ? 'border-cyan-400 bg-cyan-400/10' : 'border-slate-700 bg-slate-950/40 hover:border-slate-500 hover:bg-slate-950/70'}`}
        >
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400"><UploadIcon /></div>
          <h2 className="text-xl font-semibold text-white">Drag & Drop your PDF here</h2>
          <p className="mt-2 text-sm text-slate-500">PDF files only · Your resume stays secure</p>
          <input ref={inputRef} type="file" accept="application/pdf,.pdf" onChange={(event) => chooseFile(event.target.files?.[0])} className="hidden" />
          <button type="button" onClick={() => inputRef.current?.click()} className="mt-6 rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950">Browse Files</button>
        </div>

        {file && <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4"><div className="flex min-w-0 items-center gap-3"><div className="rounded-lg bg-red-400/10 p-2 text-red-400"><PdfIcon /></div><div className="min-w-0"><p className="truncate text-sm font-medium text-slate-200">{file.name}</p><p className="mt-1 text-xs text-slate-500">PDF document</p></div></div><span className="shrink-0 text-xs text-emerald-400">Ready</span></div>}

        <div className="mt-5 flex justify-center">
          {isLoading ? <div className="flex items-center gap-3 text-sm text-slate-400"><Loading /></div> : <button type="button" onClick={handleUpload} className="rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300">Upload and Analyze</button>}
        </div>
      </div>
    </section>
  )
}
