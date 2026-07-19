import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import { ResumeProvider } from './context/ResumeContext'
import { InterviewProvider } from './context/InterviewContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ResumeProvider>
          <InterviewProvider>
            <App />
          </InterviewProvider>
        </ResumeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
