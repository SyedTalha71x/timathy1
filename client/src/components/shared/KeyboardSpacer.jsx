import { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";

/**
 * KeyboardSpacer — keeps inputs visible when the virtual keyboard opens.
 *
 * Instead of adding empty space (which creates a scrollable blank area),
 * this component SHRINKS the nearest positioned ancestor (the modal/popup)
 * from the bottom by the keyboard height. The modal becomes shorter,
 * the scroll area shrinks with it, and scrollIntoView works naturally.
 *
 * ┌─────────────────────────────────────────────────────┐
 * │  Native (Capacitor):                                │
 * │    Uses @capacitor/keyboard for exact height.       │
 * │                                                     │
 * │  Web fallback:                                      │
 * │    Estimates keyboard height from viewport change.  │
 * └─────────────────────────────────────────────────────┘
 *
 * Drop inside any scrollable container with inputs.
 * Ignores SELECT elements and anything inside a [data-no-spacer] wrapper.
 */

const isNative = Capacitor.isNativePlatform();

/**
 * Walk up from the marker to find the nearest absolutely/fixed positioned
 * ancestor — this is the modal container we'll shrink.
 */
const findPositionedAncestor = (el) => {
  let node = el?.parentElement;
  while (node && node !== document.documentElement) {
    const position = window.getComputedStyle(node).position;
    if (position === "absolute" || position === "fixed") {
      return node;
    }
    node = node.parentElement;
  }
  return null;
};

export default function KeyboardSpacer() {
  const markerRef = useRef(null);
  const originalBottomRef = useRef(null);
  const targetRef = useRef(null);
  const focusedElRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    const onChange = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Shrink the modal by pushing its bottom edge up
  const shrinkModal = (height) => {
    const target = targetRef.current || findPositionedAncestor(markerRef.current);
    if (!target) return;
    targetRef.current = target;

    if (originalBottomRef.current === null) {
      originalBottomRef.current = target.style.bottom || "";
    }

    target.style.transition = "bottom 0.25s ease-out";
    target.style.bottom = `${height}px`;
  };

  const resetModal = () => {
    const target = targetRef.current;
    if (!target) return;
    target.style.transition = "bottom 0.25s ease-out";
    target.style.bottom = originalBottomRef.current || "";
    originalBottomRef.current = null;
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
        return;
      }

      showListener = await Keyboard.addListener("keyboardWillShow", (info) => {
        if (!markerRef.current) return;

        const el = document.activeElement;
        if (!el || (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA")) return;
        if (el.closest("[data-no-spacer]")) return;

        shrinkModal(info.keyboardHeight);
        focusedElRef.current = el;

        requestAnimationFrame(() => {
          setTimeout(() => {
            focusedElRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 50);
        });
      });

      hideListener = await Keyboard.addListener("keyboardWillHide", () => {
        resetModal();
        focusedElRef.current = null;
      });
    };

    setup();

    return () => {
      showListener?.remove?.();
      hideListener?.remove?.();
      resetModal();
    };
  }, [isMobile]);

  // ════════════════════════════════════════════
  // Web fallback: viewport-based estimation
  // ════════════════════════════════════════════
  useEffect(() => {
    if (isNative || !isMobile) return;

    const container = markerRef.current?.parentElement;
    if (!container) return;

    const onFocusIn = (e) => {
      const el = e.target;
      const tag = el.tagName;

      if (tag !== "INPUT" && tag !== "TEXTAREA") return;
      if (el.closest("[data-no-spacer]")) return;

      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.4) return;

      const inputType = el.getAttribute("type") || "text";
      const isCompactKeyboard = inputType === "tel" || inputType === "number";
      const estimatedHeight = isCompactKeyboard
        ? window.innerHeight * 0.3
        : window.innerHeight * 0.45;

      shrinkModal(estimatedHeight);

      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 80);
    };

    const onFocusOut = () => {
      setTimeout(() => {
        const active = document.activeElement;
        if (!container.contains(active) ||
            (active.tagName !== "INPUT" && active.tagName !== "TEXTAREA")) {
          resetModal();
        }
      }, 100);
    };

    container.addEventListener("focusin", onFocusIn);
    container.addEventListener("focusout", onFocusOut);
    return () => {
      container.removeEventListener("focusin", onFocusIn);
      container.removeEventListener("focusout", onFocusOut);
      resetModal();
    };
  }, [isMobile]);

  if (!isMobile) return null;

  return <div ref={markerRef} aria-hidden="true" style={{ height: 0, overflow: "hidden" }} />;
}
