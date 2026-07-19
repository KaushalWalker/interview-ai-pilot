import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/resume', label: 'Resume' },
  { to: '/analysis', label: 'Analysis' },
  { to: '/interview', label: 'Interview' },
]

export function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/dashboard" className="text-lg font-bold text-white">
          InterviewPilot AI
        </NavLink>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? 'text-cyan-400' : 'hover:text-white'
              }
            >
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated && <button onClick={logout} className="text-slate-400 hover:text-white">Logout</button>}
        </div>
      </nav>
    </header>
  )
}
