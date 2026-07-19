import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Analysis } from './pages/Analysis'
import { Dashboard } from './pages/Dashboard'
import { Interview } from './pages/Interview'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ResumeUpload } from './pages/ResumeUpload'

function App() {
  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resume" element={<ResumeUpload />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/interview" element={<Interview />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      <Toaster position="top-right" />
    </>
  )
}

export default App
