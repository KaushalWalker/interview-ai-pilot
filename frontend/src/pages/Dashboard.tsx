import { Link } from 'react-router-dom'

type IconProps = { className?: string }

function DocumentIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-4.5a2.25 2.25 0 0 0-2.25 2.25v12a2.25 2.25 0 0 0 2.25 2.25h4.5a2.25 2.25 0 0 0 2.25-2.25v-2.25m-9-7.5h9m-9 3.75h6m-9.75-6.75H5.25A2.25 2.25 0 0 0 3 8.25v9a2.25 2.25 0 0 0 2.25 2.25H9" /></svg>
}

function SparklesIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m9.813 15.904-2.29 6.086-1.1-4.074-4.074-1.1 6.086-2.29 1.378-3.667 1.378 3.667 6.086 2.29-4.074 1.1-1.1 4.074-2.29-6.086Zm6.75-8.25L18 3.75l1.438 3.904L23.25 9l-3.812 1.346L18 14.25l-1.438-3.904L12.75 9l3.813-1.346Z" /></svg>
}

function ChatIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m4.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M3.75 9.75a8.25 8.25 0 1 1 4.865 7.537L3.75 18.75l1.463-4.865A8.213 8.213 0 0 1 3.75 9.75Z" /></svg>
}

const features = [
  { title: 'Resume Upload', description: 'Bring your experience into your workspace and get ready for focused feedback.', href: '/resume', label: 'Upload resume', icon: DocumentIcon, tone: 'text-cyan-400', iconBg: 'bg-cyan-400/10' },
  { title: 'AI Resume Analysis', description: 'Turn your resume into clear, actionable insights that sharpen your story.', href: '/analysis', label: 'View analysis', icon: SparklesIcon, tone: 'text-violet-400', iconBg: 'bg-violet-400/10' },
  { title: 'Mock Interview', description: 'Practice realistic questions and build confidence with instant evaluation.', href: '/interview', label: 'Start interview', icon: ChatIcon, tone: 'text-amber-400', iconBg: 'bg-amber-400/10' },
]

export function Dashboard() {
  return (
    <section className="space-y-10">
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 px-6 py-10 sm:px-10 sm:py-14">
        <div className="absolute -right-24 -top-32 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">Your interview workspace</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Prepare with clarity. <span className="text-slate-400">Perform with confidence.</span></h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">Upload your resume, uncover opportunities, and practice with an AI coach built for your next interview.</p>
          <Link to="/resume" className="mt-8 inline-flex items-center rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900">Upload Resume <span className="ml-2" aria-hidden="true">→</span></Link>
        </div>
      </div>

      <div>
        <div className="mb-5 flex items-end justify-between gap-4"><div><h2 className="text-xl font-semibold text-white">Your preparation toolkit</h2><p className="mt-1 text-sm text-slate-500">Everything you need to make your next move.</p></div></div>
        <div className="grid gap-5 md:grid-cols-3">
          {features.map(({ title, description, href, label, icon: Icon, tone, iconBg }) => (
            <article key={title} className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 transition duration-200 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900/80">
              <div className={`mb-6 flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${tone}`}><Icon className="h-6 w-6" /></div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{description}</p>
              <Link to={href} className="mt-7 inline-flex w-fit items-center rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white">{label}<span className="ml-2 text-slate-500 transition group-hover:translate-x-0.5" aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
