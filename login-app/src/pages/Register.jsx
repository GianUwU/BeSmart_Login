import { useState, useEffect } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../translations'
import LanguageSwitcher from '../components/LanguageSwitcher'
import '../styles/Auth.css'

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    password: '',
    passwordConfirm: '',
    language: 'en',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { lang } = useParams()
  const { language, setLanguage } = useLanguage()

  useEffect(() => {
    if (lang && ['en', 'fr', 'de'].includes(lang)) {
      setLanguage(lang)
      setFormData((prev) => ({ ...prev, language: lang }))
    } else if (lang) {
      navigate('/register/en', { replace: true })
    }
  }, [lang, setLanguage, navigate])

  const t = translations[language]?.register || translations.en.register

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateEmail(formData.username)) {
      setError(t.invalidEmail)
      return
    }
    if (formData.password.length < 6) {
      setError(t.passwordTooShort)
      return
    }
    if (formData.password !== formData.passwordConfirm) {
      setError(t.passwordMismatch)
      return
    }

    setLoading(true)

    try {
      const response = await fetch('https://ipt71.kuno-schuerch.bbzwinf.ch/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          firstname: formData.firstname,
          lastname: formData.lastname,
          password: formData.password,
          language: formData.language,
        }),
      })

      const data = await response.json()

      if (data.success) {
        navigate(`/login/${language}`)
      } else {
        setError(data.reason || data.message || 'Registration failed')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <LanguageSwitcher currentPath="register" />
      <div className="auth-box">
        <h1>{t.title}</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">{t.username}</label>
            <input id="username" name="username" type="text" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="firstname">{t.firstName}</label>
            <input id="firstname" name="firstname" type="text" value={formData.firstname} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="lastname">{t.lastName}</label>
            <input id="lastname" name="lastname" type="text" value={formData.lastname} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">{t.password}</label>
            <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="passwordConfirm">{t.confirmPassword}</label>
            <input id="passwordConfirm" name="passwordConfirm" type="password" value={formData.passwordConfirm} onChange={handleChange} required />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? t.submittingButton : t.submitButton}
          </button>
        </form>
        <p className="auth-link">
          {t.hasAccount} <Link to={`/login/${language}`}>{t.loginLink}</Link>
        </p>
      </div>
    </div>
  )
}
