import { useEffect, useRef } from "react";

/**
 * Drop at the bottom of any scrollable popup container.
 * Only expands when an INPUT or TEXTAREA in the lower portion of the
 * screen is focused — so fields already visible above the keyboard
 * are left alone. SELECT elements are ignored (native picker, no keyboard).
 */
export default function KeyboardSpacer() {
  const spacerRef = useRef(null);

  useEffect(() => {
    const spacer = spacerRef.current;
    const container = spacer?.parentElement;
    if (!container) return;

    const onFocusIn = (e) => {
      const tag = e.target.tagName;
      // Only text inputs and textareas — selects use native picker, no keyboard
      if (tag !== "INPUT" && tag !== "TEXTAREA") return;

      // Only expand if the field is in the lower 45% of the viewport
      // (upper fields are already visible above the keyboard)
      const rect = e.target.getBoundingClientRect();
      const threshold = window.innerHeight * 0.55;
      if (rect.top < threshold) return;

      spacer.style.height = "50vh";
      setTimeout(() => {
        e.target.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 60);
    };

    const onFocusOut = () => {
      setTimeout(() => {
        const active = document.activeElement;
        if (!container.contains(active) ||
            (active.tagName !== "INPUT" && active.tagName !== "TEXTAREA")) {
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
