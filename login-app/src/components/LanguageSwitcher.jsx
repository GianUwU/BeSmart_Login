import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { languageNames } from '../translations'
import '../styles/LanguageSwitcher.css'

// Language switcher dropdown in the top-right corner
export default function LanguageSwitcher({ currentPath }) {
  const { language, setLanguage } = useLanguage()
  const navigate = useNavigate()
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage)
    // Update the URL to include /en /de or /fr
    const basePath = currentPath.split('/').filter(p => p && p !== language)[0] || 'login'
    navigate(`/${basePath}/${newLanguage}`)
  }

  return (
    <div className="language-switcher">
      <div className="language-dropdown">
        {/* Main button showing current language */}
        <button className="language-button" title="Select language">
          {languageNames[language]?.flag} {languageNames[language]?.name}
        </button>

        {/* Dropdown menu with all language options */}
        <div className="language-menu">
          {Object.entries(languageNames).map(([code, { flag, name }]) => (
            <button
              key={code}
              className={`language-option ${language === code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(code)}
            >
              {flag} {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
