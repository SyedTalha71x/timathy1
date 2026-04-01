import { useEffect } from "react";

/**
 * KeyboardSpacer
 *
 * Works together with Capacitor's keyboard resize mode:
 *
 *   capacitor.config.ts → plugins.Keyboard.resize = "body"
 *
 * Capacitor shrinks the <body> when the keyboard opens.
 * All absolute/fixed containers shrink with it — no spacer needed.
 *
 * This component ONLY scrolls the focused input into view.
 * It renders nothing to the DOM.
 *
 * Ignores elements inside [data-no-spacer] wrappers (e.g. CustomSelect).
 */
export default function KeyboardSpacer() {
  useEffect(() => {
    // Only on mobile/tablet
    if (window.innerWidth >= 1024) return;

    const onFocusIn = (e) => {
      const el = e.target;
      if (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA") return;
      if (el.closest("[data-no-spacer]")) return;

      // Wait for keyboard animation + body resize to settle
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    };

    document.addEventListener("focusin", onFocusIn);
    return () => document.removeEventListener("focusin", onFocusIn);
  }, []);

  return null;
}
