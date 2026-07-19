import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Loading } from '../components/Loading'
import { analyzeResume, uploadResume } from '../api/resume'
import { useResume } from '../context/ResumeContext'

export function ResumeUpload() {
  const navigate = useNavigate()
  const { setAnalysis } = useResume()
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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

  return (
    <section className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Upload Resume</h1>
        <p className="mt-2 text-slate-400">Choose a PDF to extract and analyze.</p>
      </div>
      <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <input type="file" accept="application/pdf,.pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-700 file:px-4 file:py-2 file:text-slate-100" />
        {file && <p className="text-sm text-slate-300">Selected: {file.name}</p>}
        {isLoading ? <Loading /> : <button onClick={handleUpload} className="rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400">Upload and Analyze</button>}
      </div>
    </section>
  )
}
