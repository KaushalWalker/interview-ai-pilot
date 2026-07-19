import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginRequest } from '../api/auth'

type AuthContextValue = {
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  token: string | null
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('access_token'))

  const value = useMemo<AuthContextValue>(() => ({
    token,
    isAuthenticated: Boolean(token),
    login: async (username, password) => {
      const response = await loginRequest(username, password)
      localStorage.setItem('access_token', response.access_token)
      setToken(response.access_token)
      navigate('/dashboard')
    },
    logout: () => {
      localStorage.removeItem('access_token')
      setToken(null)
      navigate('/login')
    },
  }), [navigate, token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
