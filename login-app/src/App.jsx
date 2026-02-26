import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  return (
    <Router>
      <LanguageProvider>
        <Routes>
          <Route path="/login/:lang?" element={<Login />} />
          <Route path="/register/:lang?" element={<Register />} />
          <Route path="/dashboard/:lang?" element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/login/en" replace />} />
        </Routes>
      </LanguageProvider>
    </Router>
  )
}

export default App
