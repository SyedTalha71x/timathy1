/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { Globe } from "lucide-react"

// Flags served from public/flags/ — no import needed, Vite serves them as-is
const LANGUAGES = [
  { code: "en", flag: "/flags/en.svg" },
  { code: "de", flag: "/flags/de.svg" },
  { code: "fr", flag: "/flags/fr.svg" },
  { code: "es", flag: "/flags/es.svg" },
  { code: "it", flag: "/flags/it.svg" },
]

const StudioLanguageDropdown = ({ isMobile = false }) => {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  const currentCode = i18n.language?.substring(0, 2) || "en"

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
        className={`rounded-xl text-content-muted bg-surface-card hover:bg-surface-button-hover transition-colors cursor-pointer flex items-center gap-1 ${
          isMobile ? "p-2 px-3" : "p-1.5 px-2.5"
        }`}
        aria-label={t("languages.selectLanguage")}
      >
        <Globe size={18} />
      </button>
      {isOpen && (
        <div className={`absolute ${isMobile ? "right-0 top-11 w-36" : "right-0 top-10 w-40"} bg-surface-hover/95 backdrop-blur-3xl rounded-lg shadow-lg z-[9999]`}>
          <div className="py-2" role="menu">
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => handleSelect(language)}
                className={`w-full ${isMobile ? "px-3 py-1.5" : "px-4 py-2"} text-content-primary hover:bg-surface-button text-left flex items-center gap-2 ${
                  language.code === currentCode ? "bg-surface-button" : ""
                }`}
              >
                <img draggable="false" src={language.flag} alt={t(`languages.${language.code}`)} className={`${isMobile ? "w-4 h-3" : "w-5 h-3"} rounded object-cover`} />
                <span className={isMobile ? "text-xs" : "text-sm"}>{t(`languages.${language.code}`)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StudioLanguageDropdown
