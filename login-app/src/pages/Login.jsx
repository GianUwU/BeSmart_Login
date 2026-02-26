import { useState, useEffect } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../translations'
import LanguageSwitcher from '../components/LanguageSwitcher'
import '../styles/Auth.css'

export default function Login() {
  // Login inputs
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Language Stuff
  const navigate = useNavigate()
  const { lang } = useParams() // Get language from URL (en, fr, de)

  const { language, setLanguage } = useLanguage()

  // When page loads or language changes, update the language
  useEffect(() => {
    if (lang && ['en', 'fr', 'de'].includes(lang)) {
      setLanguage(lang)
    } else if (lang) {
      // If invalid language, redirect to English
      navigate(`/login/en`, { replace: true })
    }
  }, [lang, setLanguage, navigate])

  // Get the translation text for the current language
  const t = translations[language]?.login || translations.en.login

  // Handle form submission (login)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Send login request to backend (via proxy to bypass CORS)
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      const data = await response.json()

      // Handle API response (uses success boolean, not HTTP status codes)
      if (data.success === false) {
        setError(t.loginFailed || 'Login failed. Please check your credentials.')
        return
      }

      // Save user data to browser
      if (data.username) {
        localStorage.setItem('username', data.username)
      }
      if (data.firstname) {
        localStorage.setItem('firstname', data.firstname)
      }
      if (data.lastname) {
        localStorage.setItem('lastname', data.lastname)
      }
      if (data.language) {
        localStorage.setItem('userLanguage', data.language)
      }

      // Go to dashboard
      navigate('/dashboard')
    } catch (err) {
      setError(t.errorOccurred)
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      {/* Language switcher button in top-right */}
      <LanguageSwitcher currentPath="login" />

      <div className="auth-box">
        <h1>{t.title}</h1>

        {/* Show error message if something went wrong */}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Username input */}
          <div className="form-group">
            <label htmlFor="username">{t.username}</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder={t.username}
            />
          </div>

          {/* Password input */}
          <div className="form-group">
            <label htmlFor="password">{t.password}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t.password}
            />
          </div>

          {/* Submit button */}
          <button type="submit" disabled={loading}>
            {loading ? t.submittingButton : t.submitButton}
          </button>
        </form>

        {/* Link to register page */}
        <p className="auth-link">
          {t.noAccount} <Link to={`/register/${language}`}>{t.registerLink}</Link>
        </p>
      </div>
    </div>
  )
}
