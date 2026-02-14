/* eslint-disable react/prop-types */
import { useEffect, useRef, useCallback } from "react"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

/**
 * Shared EmojiPicker component used by ChatPopup and WysiwygEditor.
 * Wraps emoji-mart Picker with consistent styling, theme detection,
 * primary color accent, and click-outside-to-close handling.
 *
 * @param {boolean} isOpen - Whether the picker is visible
 * @param {function} onEmojiSelect - Callback when emoji is selected, receives emoji object
 * @param {function} onClose - Callback to close the picker
 * @param {string} className - Additional CSS classes for positioning
 * @param {object} style - Additional inline styles for positioning
 * @param {React.Ref} pickerRef - Optional external ref for the wrapper div
 * @param {Array<string>} ignoreCloseSelectors - Additional selectors to ignore for click-outside
 */
const EmojiPicker = ({
  isOpen,
  onEmojiSelect,
  onClose,
  className = "",
  style = {},
  pickerRef: externalRef,
  ignoreCloseSelectors = [],
}) => {
  const internalRef = useRef(null)
  const ref = externalRef || internalRef

  // Click outside handler with Shadow DOM support for emoji-mart
  const handleClickOutside = useCallback((event) => {
    const path = event.composedPath?.() || []

    // Check if click is inside the picker wrapper
    const isInsidePicker = ref.current?.contains(event.target)

    // Check for emoji-mart web component elements (Shadow DOM)
    const isInEmojiMart = path.some(el =>
      el.tagName?.toLowerCase() === 'em-emoji-picker' ||
      el.classList?.contains('emoji-mart') ||
      (el.getAttribute && el.getAttribute('data-emoji-picker'))
    ) || event.target.closest?.('em-emoji-picker') ||
       event.target.closest?.('[data-emoji-picker]')

    // Check custom ignore selectors (e.g. toolbar emoji button)
    const isIgnored = ignoreCloseSelectors.some(selector =>
      event.target.closest?.(selector)
    )

    if (!isInsidePicker && !isInEmojiMart && !isIgnored) {
      onClose()
    }
  }, [ref, onClose, ignoreCloseSelectors])

  useEffect(() => {
    if (!isOpen) return

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen, handleClickOutside])

  if (!isOpen) return null

  const theme = document.documentElement.classList.contains('light') ? 'light' : 'dark'

  return (
    <div
      ref={ref}
      className={`shadow-2xl rounded-xl overflow-hidden ${className}`}
      style={{
        '--color-a': 'var(--color-primary, #f97316)',
        '--rgb-accent': 'var(--rgb-primary, 249 115 22)',
        ...style
      }}
      data-emoji-picker
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <Picker
        data={data}
        onEmojiSelect={onEmojiSelect}
        theme={theme}
        previewPosition="none"
        skinTonePosition="none"
        perLine={8}
        maxFrequentRows={2}
      />
    </div>
  )
}

export default EmojiPicker
