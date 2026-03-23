import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

// Import translation files
import en from "./locales/en.json"
import de from "./locales/de.json"
import fr from "./locales/fr.json"
import es from "./locales/es.json"
import it from "./locales/it.json"

i18n
  .use(LanguageDetector)    // Detects browser/system language automatically
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
      fr: { translation: fr },
      es: { translation: es },
      it: { translation: it },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "de", "fr", "es", "it"],

    // Language detection config
    detection: {
      // Order: check localStorage first (user preference), then browser language
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },

    interpolation: {
      escapeValue: false, // React already escapes
    },
  })

export default i18n
