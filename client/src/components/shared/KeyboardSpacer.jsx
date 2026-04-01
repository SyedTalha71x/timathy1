import { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";

/**
 * KeyboardSpacer — pushes content up when the virtual keyboard opens.
 *
 * ┌─────────────────────────────────────────────────────┐
 * │  Native (Capacitor):                                │
 * │    Uses @capacitor/keyboard for the exact keyboard  │
 * │    height in pixels. No guessing, no magic numbers. │
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
  const spacerRef = useRef(null);
  const focusedElRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);

  // Track screen size — desktop has no virtual keyboard
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    const onChange = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

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
        const spacer = spacerRef.current;
        if (!spacer) return;

        // Check if the focused element is a relevant input
        const el = document.activeElement;
        if (!el || (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA")) return;
        if (el.closest("[data-no-spacer]")) return;

        // Set exact keyboard height
        spacer.style.height = `${info.keyboardHeight}px`;
        focusedElRef.current = el;

        // Scroll the input into view — slight delay to let layout update
        requestAnimationFrame(() => {
          setTimeout(() => {
            focusedElRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 30);
        });
      });

      hideListener = await Keyboard.addListener("keyboardWillHide", () => {
        const spacer = spacerRef.current;
        if (spacer) spacer.style.height = "0px";
        focusedElRef.current = null;
      });
    };

    setup();

    return () => {
      showListener?.remove?.();
      hideListener?.remove?.();
    };
  }, [isMobile]);

  // ════════════════════════════════════════════
  // Web fallback: viewport-based estimation
  // ════════════════════════════════════════════
  useEffect(() => {
    if (isNative || !isMobile) return;

    const spacer = spacerRef.current;
    const container = spacer?.parentElement;
    if (!container) return;

    const onFocusIn = (e) => {
      const el = e.target;
      const tag = el.tagName;

      if (tag !== "INPUT" && tag !== "TEXTAREA") return;
      if (el.closest("[data-no-spacer]")) return;

      // Only expand if the field is in the lower 50% of the viewport
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.5) return;

      // Number/tel keyboards are shorter
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
  }, [isMobile]);

  if (!isMobile) return null;

  return (
    <div
      ref={spacerRef}
      style={{ height: 0, transition: "height 0.25s ease-out" }}
    />
  );
}
