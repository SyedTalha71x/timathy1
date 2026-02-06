/* eslint-disable react/prop-types */
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

/**
 * MaskedIban Component
 * Displays an IBAN in masked format with option to reveal full IBAN
 * 
 * Props:
 * - iban: The full IBAN string
 * - className: Additional classes for styling
 */
const MaskedIban = ({ iban, className = "" }) => {
  const [isRevealed, setIsRevealed] = useState(false)

  if (!iban) return <span className="text-gray-500">-</span>

  // Mask the IBAN: show first 4 chars + last 4 chars, mask middle
  const maskIban = (ibanStr) => {
    if (ibanStr.length <= 8) return ibanStr
    const start = ibanStr.slice(0, 4)
    const end = ibanStr.slice(-4)
    const middleLength = ibanStr.length - 8
    const masked = '*'.repeat(Math.min(middleLength, 8))
    return `${start}${masked}${end}`
  }

  const displayValue = isRevealed ? iban : maskIban(iban)

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="font-mono text-xs whitespace-nowrap">{displayValue}</span>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsRevealed(!isRevealed)
        }}
        className="p-0.5 text-gray-400 hover:text-white transition-colors flex-shrink-0"
        title={isRevealed ? "Hide IBAN" : "Show full IBAN"}
      >
        {isRevealed ? (
          <EyeOff className="w-3 h-3" />
        ) : (
          <Eye className="w-3 h-3" />
        )}
      </button>
    </div>
  )
}

export default MaskedIban
