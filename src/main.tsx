import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './PomodoroTimer.tsx'
import PomodoroTimer from './PomodoroTimer.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PomodoroTimer />
  </StrictMode>,
)
