import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { languageNames } from '../translations'
import '../styles/LanguageSwitcher.css'

export default function LanguageSwitcher({ currentPath }) {
  const { language, setLanguage } = useLanguage()
  const navigate = useNavigate()

  const handleChange = (lang) => {
    setLanguage(lang)
    navigate(`/${currentPath}/${lang}`)
  }

  return (
    <div className="language-switcher">
      <div className="language-dropdown">
        <button className="language-button">
          {languageNames[language]?.flag} {languageNames[language]?.name}
        </button>
        <div className="language-menu">
          {Object.entries(languageNames).map(([code, { flag, name }]) => (
            <button
              key={code}
              className={`language-option ${language === code ? 'active' : ''}`}
              onClick={() => handleChange(code)}
            >
              {flag} {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
