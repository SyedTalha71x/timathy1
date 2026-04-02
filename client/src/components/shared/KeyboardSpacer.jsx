import { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";

/**
 * GlobalKeyboardSpacer
 *
 * Mount ONCE in App.jsx. Handles every input/textarea automatically.
 *
 * Native (iOS/Android):
 *   Listens to 'capacitor-keyboard' custom events from main.jsx.
 *
 * Web fallback:
 *   Uses focusin/focusout with estimated keyboard heights.
 *
 * How it works:
 *   1. Keyboard opens → finds the focused input
 *   2. Walks up to find the nearest scrollable container
 *   3. Adds MINIMUM paddingBottom needed to scroll input into view
 *   4. Keyboard closes → removes padding
 */

const isNative = Capacitor.isNativePlatform();

/**
 * Walk up from an element to find the nearest scrollable ancestor.
 * 
 * FIX: Don't require scrollHeight > clientHeight — the container might
 * not overflow YET (before padding is added). Just check if overflow-y
 * is set to auto/scroll, which means it COULD scroll.
 */
const findScrollParent = (el) => {
  let node = el?.parentElement;
  while (node && node !== document.body && node !== document.documentElement) {
    const style = window.getComputedStyle(node);
    const overflowY = style.overflowY;
    if (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") {
      return node;
    }
    node = node.parentElement;
  }
  return null;
};

export default function GlobalKeyboardSpacer() {
  const activeContainerRef = useRef(null);
  const originalPaddingRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    const onChange = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const resetPadding = () => {
    const c = activeContainerRef.current;
    if (!c || originalPaddingRef.current === null) return;
    c.style.paddingBottom = originalPaddingRef.current;
    originalPaddingRef.current = null;
    activeContainerRef.current = null;
  };

  const adjustForInput = (input, keyboardHeight) => {
    if (!input) return;
    if (input.closest("[data-no-spacer]")) return;

    const container = findScrollParent(input);
    if (!container) {
      // No scrollable parent — just try scrollIntoView
      setTimeout(() => input.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
      return;
    }

    // Switched containers → reset old one
    if (activeContainerRef.current && activeContainerRef.current !== container) {
      resetPadding();
    }

    activeContainerRef.current = container;

    if (originalPaddingRef.current === null) {
      originalPaddingRef.current = container.style.paddingBottom || "";
    }

    const containerRect = container.getBoundingClientRect();
    const inputRect = input.getBoundingClientRect();

    // Visible area above keyboard
    const keyboardTop = window.innerHeight - keyboardHeight;
    const visibleTop = containerRect.top;
    const visibleHeight = Math.max(0, keyboardTop - visibleTop);

    // Place input in upper third of visible area
    const buffer = 60;
    const targetY = visibleTop + (visibleHeight / 3);
    const scrollNeeded = inputRect.top - targetY;

    if (scrollNeeded <= 0) {
      container.style.paddingBottom = originalPaddingRef.current || "";
      return;
    }

    const maxScroll = container.scrollHeight - container.clientHeight;
    const currentScroll = container.scrollTop;
    const scrollRoom = maxScroll - currentScroll;
    const deficit = Math.max(0, scrollNeeded - scrollRoom);

    if (deficit > 0) {
      container.style.paddingBottom = `${deficit + buffer}px`;
    }

    // Wait for layout to update with new padding, then scroll
    requestAnimationFrame(() => {
      setTimeout(() => {
        input.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 30);
    });
  };

  // ══════════════════════════════════════════════════
  // Native: Listen to custom events from main.jsx
  // ══════════════════════════════════════════════════
  useEffect(() => {
    if (!isNative || !isMobile) return;

    const onKeyboard = (e) => {
      const { height, visible } = e.detail;

      if (visible) {
        const el = document.activeElement;
        if (!el || (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA")) return;
        setTimeout(() => adjustForInput(el, height), 50);
      } else {
        resetPadding();
      }
    };

    window.addEventListener("capacitor-keyboard", onKeyboard);
    return () => {
      window.removeEventListener("capacitor-keyboard", onKeyboard);
      resetPadding();
    };
  }, [isMobile]);

  // ══════════════════════════════════════════════════
  // Web fallback
  // ══════════════════════════════════════════════════
  useEffect(() => {
    if (isNative || !isMobile) return;

    const onFocusIn = (e) => {
      const el = e.target;
      if (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA") return;
      if (el.closest("[data-no-spacer]")) return;

      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.4) return;

      const type = el.getAttribute("type") || "text";
      const compact = type === "tel" || type === "number";
      const estimated = compact ? window.innerHeight * 0.3 : window.innerHeight * 0.45;
      setTimeout(() => adjustForInput(el, estimated), 100);
    };

    const onFocusOut = () => {
      setTimeout(() => {
        const active = document.activeElement;
        if (active.tagName !== "INPUT" && active.tagName !== "TEXTAREA" && !active.isContentEditable) {
          resetPadding();
        }
      }, 150);
    };

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      resetPadding();
    };
  }, [isMobile]);

  // Renders nothing — pure side-effect component
  return null;
}
