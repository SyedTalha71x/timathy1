/* eslint-disable react/prop-types */
import { memo, useRef, useEffect, useCallback } from 'react';

export const OptimizedTextarea = memo(function OptimizedTextarea({
  value,
  onChange,
  onEnter,
  placeholder,
}) {
  const inputRef = useRef(null);
  const valueRef = useRef(value || "");
  
  // Sync with external value changes (e.g., when cleared after adding task)
  useEffect(() => {
    if (value !== valueRef.current) {
      valueRef.current = value || "";
      if (inputRef.current) {
        inputRef.current.value = value || "";
      }
    }
  }, [value]);

  // Handle input - just update ref (no re-renders)
  const handleInput = useCallback((e) => {
    valueRef.current = e.target.value;
  }, []);

  // Sync on blur for safety
  const handleBlur = useCallback(() => {
    if (onChange) {
      onChange(valueRef.current);
    }
  }, [onChange]);

  // Handle Enter key press
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentValue = valueRef.current.trim();
      if (currentValue && onEnter) {
        // Pass value directly to onEnter
        onEnter(currentValue);
        // Clear immediately for visual feedback
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        valueRef.current = "";
      }
    }
  }, [onEnter]);

  return (
    <input
      ref={inputRef}
      type="text"
      defaultValue={value}
      onInput={handleInput}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className="flex-grow bg-transparent text-content-primary outline-none text-sm placeholder-content-faint"
      style={{
        lineHeight: '28px',
      }}
    />
  );
});
