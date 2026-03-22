import { useState, useEffect, useRef } from "react";

/**
 * Drop this at the bottom of any scrollable popup container.
 * When a text input or select inside the popup is focused (keyboard open),
 * it renders a spacer that gives the scroll container room to push
 * the focused element above the keyboard.
 *
 * Usage:
 *   <div className="overflow-y-auto">
 *     ...inputs...
 *     <KeyboardSpacer />
 *   </div>
 */
export default function KeyboardSpacer() {
  const [isOpen, setIsOpen] = useState(false);
  const spacerRef = useRef(null);

  useEffect(() => {
    const container = spacerRef.current?.parentElement;
    if (!container) return;

    const onFocusIn = (e) => {
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        setIsOpen(true);
        // After spacer renders, scroll the focused element into view
        setTimeout(() => {
          e.target.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 50);
      }
    };

    const onFocusOut = () => {
      setIsOpen(false);
    };

    container.addEventListener("focusin", onFocusIn);
    container.addEventListener("focusout", onFocusOut);
    return () => {
      container.removeEventListener("focusin", onFocusIn);
      container.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  return <div ref={spacerRef} style={{ height: isOpen ? "50vh" : 0 }} />;
}
