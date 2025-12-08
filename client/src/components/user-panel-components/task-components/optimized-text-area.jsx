/* eslint-disable react/prop-types */
import { memo, useState, useCallback } from 'react';

export const OptimizedTextarea = memo(function OptimizedTextarea({
  value,
  onChange,
  onEnter,
  placeholder,
  maxLines = 4,
}) {
  const [localValue, setLocalValue] = useState(value || "");

  // Debounced onChange handler
  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
      if (onChange) {
        onChange(newValue);
      }
    });
  }, [onChange]);

  // Handle Enter key press
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (onEnter && localValue.trim()) {
        onEnter();
      }
    }
  }, [onEnter, localValue]);

  return (
    <textarea
      value={localValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className="flex-grow bg-transparent text-white outline-none resize-none overflow-y-auto text-sm custom-scrollbar placeholder-gray-500"
      style={{
        minHeight: '20px', // Reduced from 44px
        maxHeight: `${maxLines * 24}px`,
        lineHeight: '20px', // Better line spacing
        paddingTop: '4px', // Adjusted padding
        paddingBottom: '4px',
      }}
      rows={1}
    />
  );
});