import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '⌂' },
  { to: '/resume', label: 'Resume', icon: '↑' },
  { to: '/analysis', label: 'Analysis', icon: '✦' },
  { to: '/interview', label: 'Interview', icon: '◌' },
]

export function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <NavLink to="/dashboard" className="shrink-0 text-base font-bold tracking-tight text-white sm:text-lg">
          InterviewPilot <span className="text-cyan-400">AI</span>
        </NavLink>
        <div className="flex items-center gap-1 overflow-x-auto text-xs text-slate-400 sm:gap-2 sm:text-sm">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? 'rounded-lg bg-cyan-400/10 px-2.5 py-2 text-cyan-300' : 'rounded-lg px-2.5 py-2 transition hover:bg-slate-800 hover:text-white'
              }
            >
              <span className="mr-1.5 text-cyan-400" aria-hidden="true">{link.icon}</span>{link.label}
            </NavLink>
          ))}
          {isAuthenticated && <button onClick={logout} className="rounded-lg px-2.5 py-2 text-slate-400 transition hover:bg-slate-800 hover:text-white">Logout</button>}
        </div>
      </nav>
    </header>
  )
}
