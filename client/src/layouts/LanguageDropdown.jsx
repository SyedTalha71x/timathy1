/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { Globe } from "lucide-react"

const LANGUAGES = [
  { code: "en", flag: "/flags/en.svg" },
  { code: "de", flag: "/flags/de.svg" },
  { code: "fr", flag: "/flags/fr.svg" },
  { code: "es", flag: "/flags/es.svg" },
  { code: "it", flag: "/flags/it.svg" },
]

/**
 * Unified Language Dropdown
 *
 * @param {"flag"|"globe"} variant
 *   "flag"  → shows current flag as trigger (landing page / navbar)
 *   "globe" → shows globe icon as trigger (dashboard / studio)
 * @param {boolean} isMobile — slightly smaller sizing
 */
const LanguageDropdown = ({ variant = "globe", isMobile = false }) => {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  const currentCode = i18n.language?.substring(0, 2) || "en"
  const currentLanguage = LANGUAGES.find(l => l.code === currentCode) || LANGUAGES[0]

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (language) => {
    i18n.changeLanguage(language.code)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      {variant === "flag" ? (
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className={`flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-full border border-white/20 transition-all duration-300 hover:scale-105 ${
            isMobile ? "px-3 py-1.5" : "px-4 py-2"
          }`}
          aria-label={t("languages.selectLanguage")}
        >
          <img
            draggable="false"
            src={currentLanguage.flag}
            alt={t(`languages.${currentLanguage.code}`)}
            className={`${isMobile ? "w-5 h-4" : "w-6 h-5"} rounded-full object-cover`}
          />
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className={`rounded-xl text-content-muted bg-surface-card hover:bg-surface-button-hover transition-colors cursor-pointer flex items-center gap-1 ${
            isMobile ? "p-2 px-3" : "p-1.5 px-2.5"
          }`}
          aria-label={t("languages.selectLanguage")}
        >
          <Globe size={18} />
        </button>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 rounded-xl shadow-2xl z-[9999] ${
            variant === "flag"
              ? "bg-black/95 backdrop-blur-xl border border-white/10"
              : "bg-surface-hover/95 backdrop-blur-3xl"
          } ${isMobile ? "w-36" : "w-44"}`}
        >
          <div className="py-2" role="menu">
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => handleSelect(language)}
                className={`w-full flex items-center gap-2.5 text-left transition-colors first:rounded-t-xl last:rounded-b-xl ${
                  variant === "flag"
                    ? `px-4 py-2.5 text-white hover:bg-white/10 ${language.code === currentCode ? "bg-white/5" : ""}`
                    : `${isMobile ? "px-3 py-1.5" : "px-4 py-2"} text-content-primary hover:bg-surface-button ${language.code === currentCode ? "bg-surface-button" : ""}`
                }`}
              >
                <img
                  draggable="false"
                  src={language.flag}
                  alt={t(`languages.${language.code}`)}
                  className={`${isMobile ? "w-4 h-3" : "w-5 h-3.5"} rounded object-cover`}
                />
                <span className={isMobile ? "text-xs" : "text-sm"}>
                  {t(`languages.${language.code}`)}
                </span>
                {language.code === currentCode && (
                  <span className={`ml-auto text-sm ${variant === "flag" ? "text-orange-400" : "text-primary"}`}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default LanguageDropdown
