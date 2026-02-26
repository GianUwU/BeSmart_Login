import { createContext, useState, useContext } from 'react'

// Save Language as Context
const LanguageContext = createContext()

// LanguageProvider wraps app and provides language functionality
export const LanguageProvider = ({ children }) => {
  // Languages: en, fr, de
  const [language, setLanguage] = useState('en') // Default to English

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

// useLanguage hook - use this in any component to get/set the language
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
