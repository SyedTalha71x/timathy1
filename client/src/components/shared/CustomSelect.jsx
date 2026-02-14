/* eslint-disable react/prop-types */
import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronDown, Check } from "lucide-react"
import { createPortal } from "react-dom"

/**
 * CustomSelect — Drop-in replacement for native <select>.
 * Renders a fully styled dropdown that uses the app font everywhere.
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
 *     className=""                          // extra classes on the trigger
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
  className = "",
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const triggerRef = useRef(null)
  const dropdownRef = useRef(null)
  const searchRef = useRef(null)
  const [dropdownStyle, setDropdownStyle] = useState({})

  const selectedOption = options.find(opt => String(opt.value) === String(value))

  const filteredOptions = searchable && search
    ? options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()))
    : options

  // Position dropdown relative to trigger using portal
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    const dropdownHeight = Math.min(filteredOptions.length * 36 + (searchable ? 44 : 0) + 8, 240)
    const openAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow

    setDropdownStyle({
      position: "fixed",
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
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
    // Mimic native select onChange: { target: { name, value } }
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
    return () => {
      window.removeEventListener("scroll", handleReposition, true)
      window.removeEventListener("resize", handleReposition)
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
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        )
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
      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (isOpen ? closeDropdown() : openDropdown())}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`w-full bg-surface-dark text-sm rounded-xl px-4 py-2 text-left outline-none border transition-colors flex items-center justify-between gap-2 ${
          isOpen
            ? "border-primary"
            : "border-transparent hover:border-border"
        } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} ${className}`}
      >
        <span className={selectedOption ? "text-content-primary truncate" : "text-content-muted truncate"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-content-muted flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

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
                const isSelected = String(opt.value) === String(value)
                const isHighlighted = index === highlightedIndex
                return (
                  <button
                    key={opt.value}
                    type="button"
                    data-index={index}
                    onClick={() => handleSelect(opt.value)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between gap-2 transition-colors ${
                      isHighlighted
                        ? "bg-surface-hover text-content-primary"
                        : isSelected
                          ? "text-primary"
                          : "text-content-secondary hover:bg-surface-hover"
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
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
