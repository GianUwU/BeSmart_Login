import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../translations'
import LanguageSwitcher from '../components/LanguageSwitcher'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const username = localStorage.getItem('username')
  const navigate = useNavigate()
  const { lang } = useParams()
  const { language, setLanguage } = useLanguage()

  useEffect(() => {
    if (lang && ['en', 'fr', 'de'].includes(lang)) {
      setLanguage(lang)
    } else if (lang) {
      navigate('/dashboard/en', { replace: true })
    }
  }, [lang, setLanguage, navigate])

  const t = translations[language]?.dashboard || translations.en.dashboard

  useEffect(() => {
    if (!username) {
      navigate('/login/en')
      return
    }

    fetch('/api/product/list')
      .then((res) => res.json())
      .then((data) => setProducts(data.products || data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [navigate, username])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="dashboard-container">
      <LanguageSwitcher currentPath="dashboard" />
      <header className="dashboard-header">
        <h1>{t.welcome}, {username}!</h1>
        <button onClick={handleLogout} className="logout-btn">{t.logout}</button>
      </header>
      <main className="dashboard-main">
        <h2>{t.products}</h2>
        {loading && <p className="loading">{t.loading}</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && products.length === 0 && <p>{t.noProducts}</p>}
        {products.length > 0 && (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id || product.name} className="product-card">
                <h3>{product.name}</h3>
                {product.description && <p>{product.description}</p>}
                {product.price && <p className="price">${product.price}</p>}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
