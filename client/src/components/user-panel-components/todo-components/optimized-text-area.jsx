/* eslint-disable react/prop-types */
import { memo, useState, useCallback, useEffect } from 'react';

export const OptimizedTextarea = memo(function OptimizedTextarea({
  value,
  onChange,
  onEnter,
  placeholder,
}) {
  const [localValue, setLocalValue] = useState(value || "");

  // Sync local value with external value changes (e.g., when cleared after adding task)
  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  // Handle change
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
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onEnter && localValue.trim()) {
        onEnter();
        // Clear local value immediately for better UX
        setLocalValue("");
      }
    }
  }, [onEnter, localValue]);

  return (
    <input
      type="text"
      value={localValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className="flex-grow bg-transparent text-white outline-none text-sm placeholder-gray-500"
      style={{
        lineHeight: '28px',
      }}
    />
  );
});
