/* eslint-disable react/prop-types */
import React from "react";

export const LANGUAGES = [
  { code: "en", label: "EN", fullLabel: "English", flag: "🇬🇧" },
  { code: "de", label: "DE", fullLabel: "Deutsch", flag: "🇩🇪" },
  { code: "fr", label: "FR", fullLabel: "Français", flag: "🇫🇷" },
  { code: "it", label: "IT", fullLabel: "Italiano", flag: "🇮🇹" },
  { code: "es", label: "ES", fullLabel: "Español", flag: "🇪🇸" },
];

export const emptyTranslations = () => ({
  en: "",
  de: "",
  fr: "",
  it: "",
  es: "",
});

/**
 * Get translation with fallback: selected lang → English → first non-empty
 */
export const getTranslation = (obj, lang = "en") => {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return (
    (obj[lang]?.trim() ? obj[lang] : null) ||
    (obj.en?.trim() ? obj.en : null) ||
    Object.values(obj).find((v) => v?.trim()) ||
    ""
  );
};

/**
 * Get display name for a muscle/equipment option object
 */
export const getOptionName = (option, lang = "en") => {
  if (!option) return "";
  if (typeof option === "string") return option;
  return getTranslation(option.translations, lang);
};

/**
 * Generate a slug-style ID from a string
 */
export const generateId = (name) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

export default function LanguageTabs({
  selectedLang,
  onSelect,
  translations,
  className = "",
}) {
  return (
    <div className={`flex gap-1 flex-wrap ${className}`}>
      {LANGUAGES.map((lang) => {
        const hasContent = translations && translations[lang.code]?.trim();
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => onSelect(lang.code)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors relative cursor-pointer ${
              selectedLang === lang.code
                ? "bg-blue-600 text-white"
                : hasContent
                  ? "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                  : "bg-[#2F2F2F] text-gray-500 hover:bg-[#3F3F3F]"
            }`}
          >
            {lang.flag} {lang.label}
            {hasContent && selectedLang !== lang.code && (
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
