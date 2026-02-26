import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import './App.css'

// Main App component
function App() {
  return (
    <Router>
      {/* LanguageProvider makes language available to all components */}
      <LanguageProvider>
        <Routes>
          {/* Routes with :lang? so URLs like /login/en, /login/fr work */}
          <Route path="/login/:lang?" element={<Login />} />
          <Route path="/register/:lang?" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* If user goes to /, redirect to /login/en (English) */}
          <Route path="/" element={<Navigate to="/login/en" replace />} />
        </Routes>
      </LanguageProvider>
    </Router>
  )
}

export default App
