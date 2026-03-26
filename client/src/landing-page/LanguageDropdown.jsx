/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"

// Flags served from public/flags/ — no import needed, Vite serves them as-is
const LANGUAGES = [
  { code: "en", flag: "/flags/en.svg", name: "English" },
  { code: "de", flag: "/flags/de.svg", name: "Deutsch" },
  { code: "fr", flag: "/flags/fr.svg", name: "Français" },
  { code: "es", flag: "/flags/es.svg", name: "Español" },
  { code: "it", flag: "/flags/it.svg", name: "Italiano" },
]

const NavBarLanguageDropdown = ({ isMobile = false }) => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  const currentCode = i18n.language?.substring(0, 2) || "en"
  const currentLanguage = LANGUAGES.find(lang => lang.code === currentCode) || LANGUAGES[0]

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggle = () => setIsOpen(prev => !prev)

  const handleSelect = (language) => {
    i18n.changeLanguage(language.code)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        className={`
          flex items-center gap-2 
          bg-white/5 hover:bg-white/10 
          backdrop-blur-xl 
          rounded-full 
          border border-white/20 
          transition-all duration-300 
          hover:scale-105
          ${isMobile ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-base'}
        `}
        aria-label="Language selector"
      >
        {/* Nur die abgerundete Flagge - kein Text, kein Globus */}
        <img 
          draggable="false" 
          src={currentLanguage.flag} 
          alt={currentLanguage.name}
          className={`${isMobile ? 'w-5 h-4' : 'w-6 h-5'} rounded-full object-cover`}
        />
      </button>

      {isOpen && (
        <div className={`
          absolute right-0 mt-2 
          bg-black/95 backdrop-blur-xl 
          rounded-xl 
          border border-white/10 
          shadow-2xl 
          z-50
          ${isMobile ? 'w-40' : 'w-48'}
        `}>
          <div className="py-2" role="menu">
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => handleSelect(language)}
                className={`
                  w-full flex items-center gap-3 
                  px-4 py-2.5 
                  text-white 
                  hover:bg-white/10 
                  transition-colors 
                  ${language.code === currentCode ? 'bg-white/5' : ''}
                  first:rounded-t-xl 
                  last:rounded-b-xl
                `}
              >
                <img 
                  draggable="false" 
                  src={language.flag} 
                  alt={language.name}
                  className={`${isMobile ? 'w-5 h-4' : 'w-6 h-5'} rounded-full object-cover`}
                />
                <span className={`${isMobile ? 'text-sm' : 'text-base'}`}>
                  {language.name}
                </span>
                {language.code === currentCode && (
                  <span className="ml-auto text-orange-400 text-sm">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default NavBarLanguageDropdown