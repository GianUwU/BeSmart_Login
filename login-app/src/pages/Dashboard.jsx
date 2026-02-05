import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const username = localStorage.getItem('username')
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in
    if (!localStorage.getItem('token')) {
      navigate('/login')
      return
    }

    // Fetch products
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://ipt71.kuno-schuerch.bbzwinf.ch/product/list', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.message || 'Failed to fetch products')
          return
        }

        setProducts(data.products || data || [])
      } catch (err) {
        setError('An error occurred while fetching products.')
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/login')
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {username}!</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <main className="dashboard-main">
        <section className="products-section">
          <h2>Products</h2>
          {loading && <p className="loading">Loading products...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && products.length === 0 && (
            <p className="no-products">No products available</p>
          )}
          {!loading && products.length > 0 && (
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
        </section>
      </main>
    </div>
  )
}
