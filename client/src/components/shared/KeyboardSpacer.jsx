import { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";

/**
 * KeyboardSpacer — pushes content up when the virtual keyboard opens.
 *
 * Instead of rendering a visible empty div (which looks like a bug when
 * scrolling), this component modifies the parent container's paddingBottom.
 * The result is invisible scroll space — no empty block the user can see.
 *
 * ┌─────────────────────────────────────────────────────┐
 * │  Native (Capacitor):                                │
 * │    Uses @capacitor/keyboard for the exact keyboard  │
 * │    height in pixels.                                │
 * │                                                     │
 * │  Web fallback:                                      │
 * │    Estimates height via viewport percentages         │
 * │    (50vh full / 30vh compact keyboard).              │
 * └─────────────────────────────────────────────────────┘
 *
 * Drop at the bottom of any scrollable container with inputs.
 * Ignores SELECT elements and anything inside a [data-no-spacer] wrapper.
 */

const isNative = Capacitor.isNativePlatform();

export default function KeyboardSpacer() {
  const markerRef = useRef(null);
  const originalPaddingRef = useRef(null);
  const focusedElRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);

  // Track screen size — desktop has no virtual keyboard
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    const onChange = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Get the scroll container (parent of this marker)
  const getContainer = () => markerRef.current?.parentElement;

  // Apply padding to parent instead of using a visible spacer div
  const applyPadding = (value) => {
    const container = getContainer();
    if (!container) return;

    // Save original padding on first use
    if (originalPaddingRef.current === null) {
      originalPaddingRef.current = container.style.paddingBottom || "";
    }

    container.style.paddingBottom = value;
  };

  const resetPadding = () => {
    const container = getContainer();
    if (!container) return;
    container.style.paddingBottom = originalPaddingRef.current || "";
    originalPaddingRef.current = null;
  };

  // ════════════════════════════════════════════
  // Native: Capacitor Keyboard plugin
  // ════════════════════════════════════════════
  useEffect(() => {
    if (!isNative || !isMobile) return;

    let Keyboard;
    let showListener;
    let hideListener;

    const setup = async () => {
      try {
        const mod = await import("@capacitor/keyboard");
        Keyboard = mod.Keyboard;
      } catch {
        return; // Plugin not installed — will fall through to web fallback
      }

      showListener = await Keyboard.addListener("keyboardWillShow", (info) => {
        if (!markerRef.current) return;

        const el = document.activeElement;
        if (!el || (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA")) return;
        if (el.closest("[data-no-spacer]")) return;

        applyPadding(`${info.keyboardHeight}px`);
        focusedElRef.current = el;

        requestAnimationFrame(() => {
          setTimeout(() => {
            focusedElRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 30);
        });
      });

      hideListener = await Keyboard.addListener("keyboardWillHide", () => {
        resetPadding();
        focusedElRef.current = null;
      });
    };

    setup();

    return () => {
      showListener?.remove?.();
      hideListener?.remove?.();
      resetPadding();
    };
  }, [isMobile]);

  // ════════════════════════════════════════════
  // Web fallback: viewport-based estimation
  // ════════════════════════════════════════════
  useEffect(() => {
    if (isNative || !isMobile) return;

    const container = getContainer();
    if (!container) return;

    const onFocusIn = (e) => {
      const el = e.target;
      const tag = el.tagName;

      if (tag !== "INPUT" && tag !== "TEXTAREA") return;
      if (el.closest("[data-no-spacer]")) return;

      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.5) return;

      const inputType = el.getAttribute("type") || "text";
      const isCompactKeyboard = inputType === "tel" || inputType === "number";
      applyPadding(isCompactKeyboard ? "30vh" : "50vh");

      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 60);
    };

    const onFocusOut = () => {
      setTimeout(() => {
        const active = document.activeElement;
        if (!container.contains(active) ||
            (active.tagName !== "INPUT" && active.tagName !== "TEXTAREA")) {
          resetPadding();
        }
      }, 100);
    };

    container.addEventListener("focusin", onFocusIn);
    container.addEventListener("focusout", onFocusOut);
    return () => {
      container.removeEventListener("focusin", onFocusIn);
      container.removeEventListener("focusout", onFocusOut);
      resetPadding();
    };
  }, [isMobile]);

  if (!isMobile) return null;

  // Invisible marker — zero height, no visual impact
  // Only used to find the parent container
  return <div ref={markerRef} aria-hidden="true" style={{ height: 0, overflow: "hidden" }} />;
}
