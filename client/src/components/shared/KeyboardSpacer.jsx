import { useEffect, useRef } from "react";

/**
 * KeyboardSpacer
 *
 * Uses the VisualViewport API to detect the keyboard height, then:
 * 1. Adds paddingBottom to the scroll container = keyboard height
 * 2. Scrolls the focused input into the visible area
 *
 * The padding is BEHIND the keyboard — the user can never see it.
 * When the keyboard closes, the padding is removed instantly.
 *
 * No visible artifacts. No empty space. No modal resizing.
 *
 * Works with `resize: "none"` in capacitor.config.json.
 * Drop inside any scrollable container that has inputs.
 */
export default function KeyboardSpacer() {
  const markerRef = useRef(null);
  const containerRef = useRef(null);
  const originalPaddingRef = useRef(null);
  const keyboardVisibleRef = useRef(false);

  useEffect(() => {
    if (window.innerWidth >= 1024) return;

    const vv = window.visualViewport;
    if (!vv) return;

    const getContainer = () => {
      if (containerRef.current) return containerRef.current;
      containerRef.current = markerRef.current?.parentElement || null;
      return containerRef.current;
    };

    const handleResize = () => {
      const container = getContainer();
      if (!container) return;

      // Keyboard height = difference between layout viewport and visual viewport
      const keyboardHeight = window.innerHeight - vv.height;
      const isKeyboardOpen = keyboardHeight > 100; // Threshold to avoid false positives

      if (isKeyboardOpen && !keyboardVisibleRef.current) {
        // Keyboard just opened
        keyboardVisibleRef.current = true;

        if (originalPaddingRef.current === null) {
          originalPaddingRef.current = container.style.paddingBottom || "";
        }
        container.style.paddingBottom = `${keyboardHeight}px`;

        // Scroll focused input into visible area
        setTimeout(() => {
          const el = document.activeElement;
          if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) {
            if (!el.closest("[data-no-spacer]")) {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }
        }, 50);

      } else if (isKeyboardOpen && keyboardVisibleRef.current) {
        // Keyboard still open but height changed (e.g. autocomplete bar toggled)
        container.style.paddingBottom = `${keyboardHeight}px`;

      } else if (!isKeyboardOpen && keyboardVisibleRef.current) {
        // Keyboard closed
        keyboardVisibleRef.current = false;
        container.style.paddingBottom = originalPaddingRef.current || "";
        originalPaddingRef.current = null;
      }
    };

    // Also scroll on focus change while keyboard is open
    const handleFocusIn = (e) => {
      if (!keyboardVisibleRef.current) return;
      const el = e.target;
      if (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA") return;
      if (el.closest("[data-no-spacer]")) return;

      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    };

    vv.addEventListener("resize", handleResize);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      vv.removeEventListener("resize", handleResize);
      document.removeEventListener("focusin", handleFocusIn);

      // Cleanup
      const container = getContainer();
      if (container && originalPaddingRef.current !== null) {
        container.style.paddingBottom = originalPaddingRef.current;
      }
    };
  }, []);

  return <div ref={markerRef} aria-hidden="true" style={{ height: 0, overflow: "hidden" }} />;
}
