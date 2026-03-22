import { useEffect, useRef } from "react";

/**
 * Drop at the bottom of any scrollable popup container.
 * Only expands when an INPUT or TEXTAREA in the lower portion of the
 * screen is focused. Ignores SELECT elements and anything inside
 * a [data-no-spacer] wrapper (e.g. CustomSelect components).
 * Uses a smaller spacer for number/tel keyboards.
 */
export default function KeyboardSpacer() {
  const spacerRef = useRef(null);

  useEffect(() => {
    const spacer = spacerRef.current;
    const container = spacer?.parentElement;
    if (!container) return;

    const onFocusIn = (e) => {
      const el = e.target;
      const tag = el.tagName;

      // Only text inputs and textareas — selects use native picker
      if (tag !== "INPUT" && tag !== "TEXTAREA") return;

      // Ignore inputs inside [data-no-spacer] wrappers (e.g. CustomSelect)
      if (el.closest("[data-no-spacer]")) return;

      // Only expand if the field is in the lower 50% of the viewport
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.5) return;

      // Number/tel keyboards are shorter — use less space
      const inputType = el.getAttribute("type") || "text";
      const isCompactKeyboard = inputType === "tel" || inputType === "number";
      spacer.style.height = isCompactKeyboard ? "30vh" : "50vh";

      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
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
