/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { Globe } from "lucide-react"

const LANGUAGES = [
  { code: "en", name: "English", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/1280px-Flag_of_the_United_States.svg.png" },
  { code: "de", name: "German", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/2560px-Flag_of_Germany.svg.png" },
  { code: "fr", name: "French", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/1280px-Flag_of_France.svg.png" },
  { code: "es", name: "Spanish", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Spain.svg/1280px-Flag_of_Spain.svg.png" },
  { code: "it", name: "Italian", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/1280px-Flag_of_Italy.svg.png" },
]

const StudioLanguageDropdown = ({ isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggle = () => setIsOpen(prev => !prev)

  const handleSelect = (language) => {
    setSelectedLanguage(language.name)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        className={`rounded-xl text-content-muted bg-surface-card hover:bg-surface-button-hover transition-colors cursor-pointer flex items-center gap-1 ${
          isMobile ? "p-2 px-3" : "p-1.5 px-2.5"
        }`}
        aria-label="Language Selection"
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
                className={`block w-full ${isMobile ? "px-3 py-1.5" : "px-4 py-2"} text-content-primary hover:bg-surface-button text-left flex items-center gap-2`}
              >
                <img draggable="false" src={language.flag} alt={language.name} className={`${isMobile ? "w-4 h-3" : "w-5 h-3"} rounded`} />
                <span className={isMobile ? "text-xs" : "text-sm"}>{language.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StudioLanguageDropdown
