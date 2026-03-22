import { useEffect, useRef } from "react";

/**
 * Drop this at the bottom of any scrollable popup container.
 * When a text input or select inside the popup is focused (keyboard open),
 * it expands to give the scroll container room to push the focused element
 * above the keyboard.
 *
 * Uses direct DOM manipulation to avoid React re-renders that would
 * steal focus from the input on iOS.
 *
 * Usage:
 *   <div className="overflow-y-auto">
 *     ...inputs...
 *     <KeyboardSpacer />
 *   </div>
 */
export default function KeyboardSpacer() {
  const spacerRef = useRef(null);

  useEffect(() => {
    const spacer = spacerRef.current;
    const container = spacer?.parentElement;
    if (!container) return;

    const onFocusIn = (e) => {
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        // Expand spacer via DOM — no React rerender, no focus loss
        spacer.style.height = "50vh";
        // Scroll focused element into view after spacer expands
        setTimeout(() => {
          e.target.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 60);
      }
    };

    const onFocusOut = () => {
      // Small delay to avoid collapsing when focus moves between inputs
      setTimeout(() => {
        if (!container.contains(document.activeElement) ||
            (document.activeElement.tagName !== "INPUT" &&
             document.activeElement.tagName !== "TEXTAREA" &&
             document.activeElement.tagName !== "SELECT")) {
          spacer.style.height = "0px";
        }
      }, 100);
    };

    container.addEventListener("focusin", onFocusIn);
    container.addEventListener("focusout", onFocusOut);
    return () => {
      container.removeEventListener("focusin", onFocusIn);
      container.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  return <div ref={spacerRef} style={{ height: 0 }} />;
}
