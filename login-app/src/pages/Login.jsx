import { useState, useEffect } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../translations'
import LanguageSwitcher from '../components/LanguageSwitcher'
import '../styles/Auth.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { lang } = useParams()
  const { language, setLanguage } = useLanguage()

  useEffect(() => {
    if (lang && ['en', 'fr', 'de'].includes(lang)) {
      setLanguage(lang)
    } else if (lang) {
      navigate('/login/en', { replace: true })
    }
  }, [lang, setLanguage, navigate])

  const t = translations[language]?.login || translations.en.login

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('https://ipt71.kuno-schuerch.bbzwinf.ch/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('username', data.username || username)
        if (data.firstname) localStorage.setItem('firstname', data.firstname)
        if (data.lastname) localStorage.setItem('lastname', data.lastname)
        if (data.language) localStorage.setItem('userLanguage', data.language)
        navigate('/dashboard')
      } else {
        setError(data.reason || data.message || 'Login failed')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <LanguageSwitcher currentPath="login" />
      <div className="auth-box">
        <h1>{t.title}</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">{t.username}</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">{t.password}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? t.submittingButton : t.submitButton}
          </button>
        </form>
        <p className="auth-link">
          {t.noAccount} <Link to={`/register/${language}`}>{t.registerLink}</Link>
        </p>
      </div>
    </div>
  )
}
