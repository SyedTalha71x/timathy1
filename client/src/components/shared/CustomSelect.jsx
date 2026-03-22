/* eslint-disable react/prop-types */
import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronDown, Check } from "lucide-react"
import { createPortal } from "react-dom"

/**
 * CustomSelect — Drop-in replacement for native <select>.
 * Renders a fully styled dropdown that uses the app font everywhere.
 * Trigger is a readOnly <input> so it matches adjacent inputs pixel-perfectly.
 * Visual styling (bg, padding, border) comes via className prop.
 *
 * Usage:
 *   <CustomSelect
 *     name="gender"
 *     value={staff.gender}
 *     onChange={handleInputChange}         // receives synthetic { target: { name, value } }
 *     options={[
 *       { value: "male", label: "Male" },
 *       { value: "female", label: "Female" },
 *     ]}
 *     placeholder="Select gender"
 *     disabled={false}
 *     required={false}
 *     className="bg-surface-dark px-4 py-2 border-transparent"  // match surrounding inputs
 *   />
 */
const CustomSelect = ({
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  disabled = false,
  required = false,
  className = "bg-surface-dark px-4 py-2 border-transparent hover:border-border",
  searchable = false,
  multi = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const triggerRef = useRef(null)
  const dropdownRef = useRef(null)
  const searchRef = useRef(null)
  const [dropdownStyle, setDropdownStyle] = useState({})

  // Multi: value is an array; Single: value is a string
  const multiValue = multi ? (Array.isArray(value) ? value : []) : null
  const selectedOption = multi ? null : options.find(opt => String(opt.value) === String(value))

  // Display text
  const displayText = multi
    ? multiValue.length === 0 || multiValue.includes("All")
      ? placeholder
      : multiValue.length === 1
        ? options.find(opt => opt.value === multiValue[0])?.label || multiValue[0]
        : `${multiValue.length} selected`
    : selectedOption ? selectedOption.label : ""

  const filteredOptions = searchable && search
    ? options.filter(opt => opt.divider || opt.label.toLowerCase().includes(search.toLowerCase()))
    : options

  // Position dropdown relative to trigger using portal
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    // Use visualViewport for accurate visible area (accounts for iOS keyboard)
    const viewportHeight = window.visualViewport?.height || window.innerHeight
    const viewportOffset = window.visualViewport?.offsetTop || 0
    const spaceBelow = viewportHeight + viewportOffset - rect.bottom
    const spaceAbove = rect.top - viewportOffset
    const dropdownHeight = Math.min(filteredOptions.length * 36 + (searchable ? 44 : 0) + 8, 240)
    const openAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow

    setDropdownStyle({
      position: "fixed",
      left: rect.left,
      width: rect.width,
      zIndex: 99999999,
      ...(openAbove
        ? { bottom: window.innerHeight - rect.top + 4 }
        : { top: rect.bottom + 4 }),
    })
  }, [filteredOptions.length, searchable])

  // Open / close
  const openDropdown = () => {
    if (disabled) return
    updatePosition()
    setIsOpen(true)
    setSearch("")
    setHighlightedIndex(-1)
  }

  const closeDropdown = () => {
    setIsOpen(false)
    setSearch("")
  }

  const handleSelect = (optionValue) => {
    if (multi) {
      let newValue
      // "All" resets selection
      if (optionValue === "All") {
        newValue = ["All"]
      } else {
        const current = multiValue.filter(v => v !== "All")
        if (current.includes(optionValue)) {
          newValue = current.filter(v => v !== optionValue)
          if (newValue.length === 0) newValue = ["All"]
        } else {
          newValue = [...current, optionValue]
        }
      }
      onChange({ target: { name, value: newValue } })
      // Don't close dropdown for multi-select
      return
    }
    // Single select
    onChange({ target: { name, value: optionValue } })
    closeDropdown()
    triggerRef.current?.focus()
  }

  // Click outside
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e) => {
      if (
        triggerRef.current?.contains(e.target) ||
        dropdownRef.current?.contains(e.target)
      ) return
      closeDropdown()
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  // Reposition on scroll / resize
  useEffect(() => {
    if (!isOpen) return
    const handleReposition = () => updatePosition()
    window.addEventListener("scroll", handleReposition, true)
    window.addEventListener("resize", handleReposition)
    window.addEventListener("capacitor-keyboard", handleReposition)
    // Reposition when iOS keyboard opens/closes
    const vv = window.visualViewport
    if (vv) vv.addEventListener("resize", handleReposition)
    return () => {
      window.removeEventListener("scroll", handleReposition, true)
      window.removeEventListener("resize", handleReposition)
      window.removeEventListener("capacitor-keyboard", handleReposition)
      if (vv) vv.removeEventListener("resize", handleReposition)
    }
  }, [isOpen, updatePosition])

  // Focus search when opened
  useEffect(() => {
    if (isOpen && searchable) {
      setTimeout(() => searchRef.current?.focus(), 0)
    }
  }, [isOpen, searchable])

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return

    if (!isOpen) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault()
        openDropdown()
      }
      return
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex(prev => {
          let next = prev < filteredOptions.length - 1 ? prev + 1 : 0
          while (filteredOptions[next]?.divider && next < filteredOptions.length - 1) next++
          return filteredOptions[next]?.divider ? prev : next
        })
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex(prev => {
          let next = prev > 0 ? prev - 1 : filteredOptions.length - 1
          while (filteredOptions[next]?.divider && next > 0) next--
          return filteredOptions[next]?.divider ? prev : next
        })
        break
      case "Enter":
        e.preventDefault()
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value)
        }
        break
      case "Escape":
        e.preventDefault()
        closeDropdown()
        triggerRef.current?.focus()
        break
      default:
        break
    }
  }

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex < 0 || !dropdownRef.current) return
    const el = dropdownRef.current.querySelector(`[data-index="${highlightedIndex}"]`)
    el?.scrollIntoView({ block: "nearest" })
  }, [highlightedIndex])

  return (
    <>
      {/* Trigger — uses a readOnly input so height matches adjacent inputs exactly */}
      <div className="relative">
        <input
          ref={triggerRef}
          type="text"
          readOnly
          value={displayText}
          placeholder={placeholder}
          onClick={() => (isOpen ? closeDropdown() : openDropdown())}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className={`w-full text-sm rounded-xl outline-none border transition-colors cursor-pointer pr-9 text-content-primary placeholder:text-content-faint ${
            disabled ? "opacity-60 cursor-not-allowed" : ""
          } ${className} ${isOpen ? "!border-primary" : ""}`}
        />
        <ChevronDown
          size={16}
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-content-muted pointer-events-none transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {/* Hidden native select for form validation */}
      {required && (
        <select
          name={name}
          value={value}
          required={required}
          tabIndex={-1}
          className="sr-only"
          onChange={() => {}}
          aria-hidden="true"
        >
          <option value="">{placeholder}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}

      {/* Dropdown via portal */}
      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          style={dropdownStyle}
          className="bg-surface-card border border-border rounded-xl shadow-xl overflow-hidden"
          onKeyDown={handleKeyDown}
        >
          {/* Search input (optional) */}
          {searchable && (
            <div className="p-2 border-b border-border">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setHighlightedIndex(0)
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  // Reposition after keyboard finishes animating
                  setTimeout(updatePosition, 350)
                  setTimeout(updatePosition, 600)
                }}
                placeholder="Search..."
                className="w-full bg-surface-dark text-sm text-content-primary rounded-lg px-3 py-1.5 outline-none border border-transparent focus:border-primary transition-colors"
              />
            </div>
          )}

          {/* Options list */}
          <div className="max-h-[200px] overflow-y-auto py-1 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-content-faint text-center">
                No options found
              </div>
            ) : (
              filteredOptions.map((opt, index) => {
                // Divider support
                if (opt.divider) {
                  return <div key={`divider-${index}`} className="my-1 border-t border-border mx-2" />
                }
                const isSelected = multi
                  ? multiValue.includes(opt.value)
                  : String(opt.value) === String(value)
                const isHighlighted = index === highlightedIndex
                return (
                  <button
                    key={opt.value}
                    type="button"
                    data-index={index}
                    onClick={() => handleSelect(opt.value)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
                      isHighlighted
                        ? "bg-surface-hover text-content-primary"
                        : isSelected
                          ? "text-primary"
                          : "text-content-secondary hover:bg-surface-hover"
                    }`}
                  >
                    {multi && (
                      <div className={`w-4 h-4 border rounded flex items-center justify-center flex-shrink-0 ${
                        isSelected ? "bg-primary border-primary" : "border-content-faint"
                      }`}>
                        {isSelected && <Check size={10} className="text-white" />}
                      </div>
                    )}
                    <span className="truncate flex-1">{opt.label}</span>
                    {!multi && isSelected && (
                      <Check size={14} className="text-primary flex-shrink-0" />
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

export default CustomSelect
