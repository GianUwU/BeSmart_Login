import { useState, useEffect } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../translations'
import LanguageSwitcher from '../components/LanguageSwitcher'
import '../styles/Auth.css'

export default function Register() {
  // Register Inputs
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

  // Language Stuff
  const navigate = useNavigate()
  const { lang } = useParams() // Get language from URL (en, fr, de)

  const { language, setLanguage } = useLanguage()

  // When page loads or language changes, update the language
  useEffect(() => {
    if (lang && ['en', 'fr', 'de'].includes(lang)) {
      setLanguage(lang)
      // Also update the language preference in the form
      setFormData((prev) => ({
        ...prev,
        language: lang,
      }))
    } else if (lang) {
      // If invalid language, redirect to English
      navigate(`/register/en`, { replace: true })
    }
  }, [lang, setLanguage, navigate])

  // Get the translation text for the current language
  const t = translations[language]?.register || translations.en.register

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // When user types in a form field
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submission (register)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate username (email format)
    if (!formData.username || !validateEmail(formData.username)) {
      setError(t.invalidEmail || 'Please enter a valid email address')
      return
    }

    // Validate first name
    if (!formData.firstname || formData.firstname.trim().length < 2) {
      setError(t.invalidFirstName || 'First name must be at least 2 characters')
      return
    }

    // Validate last name
    if (!formData.lastname || formData.lastname.trim().length < 2) {
      setError(t.invalidLastName || 'Last name must be at least 2 characters')
      return
    }

    // Validate password not empty
    if (!formData.password) {
      setError(t.passwordRequired || 'Password is required')
      return
    }

    // Check if password is long enough (API requires minimum 10 characters)
    if (formData.password.length < 10) {
      setError(t.passwordTooShort || 'Password must be at least 10 characters')
      return
    }

    // Check if passwords match
    if (formData.password !== formData.passwordConfirm) {
      setError(t.passwordMismatch)
      return
    }

    setLoading(true)

    try {
      // Send registration request to backend (via proxy to bypass CORS)
      const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          firstname: formData.firstname,
          lastname: formData.lastname,
          password: formData.password,
          language: formData.language,
        }),
      })

      const data = await response.json()

      // Handle API response (uses success boolean, not HTTP status codes)
      if (data.success === false) {
        // API returns reason codes for specific errors
        let errorMessage = t.registrationFailed || 'Registration failed'
        
        if (data.reason === 'password_too_short') {
          errorMessage = t.passwordTooShort || 'Password must be at least 10 characters'
        } else if (data.reason === 'username_not_valid') {
          errorMessage = t.invalidEmail || 'Username must be a valid email address'
        } else if (data.reason) {
          errorMessage = `Error: ${data.reason}`
        }
        
        setError(errorMessage)
        return
      }

      // Go to login page after successful registration
      navigate(`/login/${language}`, {
        state: { message: t.registrationSuccess },
      })
    } catch (err) {
      setError(t.errorOccurred)
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      {/* Language switcher button in top-right */}
      <LanguageSwitcher currentPath="register" />

      <div className="auth-box register-box">
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
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder={t.username}
            />
          </div>

          {/* First Name input */}
          <div className="form-group">
            <label htmlFor="firstname">{t.firstName}</label>
            <input
              id="firstname"
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
              placeholder={t.firstName}
            />
          </div>

          {/* Last Name input */}
          <div className="form-group">
            <label htmlFor="lastname">{t.lastName}</label>
            <input
              id="lastname"
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
              placeholder={t.lastName}
            />
          </div>

          {/* Password input */}
          <div className="form-group">
            <label htmlFor="password">{t.password}</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder={t.password}
            />
          </div>

          {/* Confirm Password input */}
          <div className="form-group">
            <label htmlFor="passwordConfirm">{t.confirmPassword}</label>
            <input
              id="passwordConfirm"
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
              placeholder={t.confirmPassword}
            />
          </div>

          {/* Submit button */}
          <button type="submit" disabled={loading}>
            {loading ? t.submittingButton : t.submitButton}
          </button>
        </form>

        {/* Link to login page */}
        <p className="auth-link">
          {t.hasAccount} <Link to={`/login/${language}`}>{t.loginLink}</Link>
        </p>
      </div>
    </div>
  )
}
