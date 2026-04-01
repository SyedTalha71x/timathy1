import { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";

/**
 * KeyboardSpacer
 *
 * Calculates the MINIMUM padding needed to scroll the focused input
 * into the visible area above the keyboard. No more, no less.
 *
 * Top inputs → 0px padding (already visible)
 * Bottom inputs → just enough to scroll them up
 *
 * No wasted space. No visible empty areas.
 */

const isNative = Capacitor.isNativePlatform();

export default function KeyboardSpacer() {
  const markerRef = useRef(null);
  const containerRef = useRef(null);
  const originalPaddingRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    const onChange = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const getContainer = () => {
    if (!containerRef.current) {
      containerRef.current = markerRef.current?.parentElement || null;
    }
    return containerRef.current;
  };

  const resetPadding = () => {
    const c = getContainer();
    if (!c || originalPaddingRef.current === null) return;
    c.style.paddingBottom = originalPaddingRef.current;
    originalPaddingRef.current = null;
  };

  /**
   * Calculate minimum padding and scroll the input into view.
   * @param {HTMLElement} input - the focused input
   * @param {number} keyboardHeight - keyboard height in px
   */
  const adjustForInput = (input, keyboardHeight) => {
    const container = getContainer();
    if (!container || !input) return;

    // Save original padding once
    if (originalPaddingRef.current === null) {
      originalPaddingRef.current = container.style.paddingBottom || "";
    }

    const containerRect = container.getBoundingClientRect();
    const inputRect = input.getBoundingClientRect();

    // Visible area = space between container top and keyboard top
    const keyboardTop = window.innerHeight - keyboardHeight;
    const visibleTop = containerRect.top;
    const visibleHeight = Math.max(0, keyboardTop - visibleTop);

    // Where we want the input: centered in the visible area, with some margin
    const margin = 20;
    const targetY = visibleTop + (visibleHeight / 2) - (inputRect.height / 2);

    // How far the input currently is from where we want it
    const currentY = inputRect.top;
    const scrollNeeded = currentY - targetY;

    if (scrollNeeded <= 0) {
      // Input is already above the target — no padding needed
      container.style.paddingBottom = originalPaddingRef.current || "";
      return;
    }

    // Check if we CAN scroll that far with current content
    const maxScroll = container.scrollHeight - container.clientHeight;
    const currentScroll = container.scrollTop;
    const scrollRoom = maxScroll - currentScroll;

    // Only add padding for the deficit
    const deficit = Math.max(0, scrollNeeded - scrollRoom);

    if (deficit > 0) {
      container.style.paddingBottom = `${deficit + margin}px`;
    }

    // Scroll after padding is applied
    requestAnimationFrame(() => {
      input.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  // ════════════════════════════════════════════
  // Native: Capacitor Keyboard plugin
  // ════════════════════════════════════════════
  useEffect(() => {
    if (!isNative || !isMobile) return;

    let showListener, hideListener;

    const setup = async () => {
      let Keyboard;
      try {
        const mod = await import("@capacitor/keyboard");
        Keyboard = mod.Keyboard;
      } catch {
        return;
      }

      showListener = await Keyboard.addListener("keyboardWillShow", (info) => {
        const el = document.activeElement;
        if (!el || (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA")) return;
        if (el.closest("[data-no-spacer]")) return;

        // Small delay so layout settles
        setTimeout(() => adjustForInput(el, info.keyboardHeight), 50);
      });

      hideListener = await Keyboard.addListener("keyboardWillHide", () => {
        resetPadding();
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
  // Web fallback
  // ════════════════════════════════════════════
  useEffect(() => {
    if (isNative || !isMobile) return;

    const container = markerRef.current?.parentElement;
    if (!container) return;

    const onFocusIn = (e) => {
      const el = e.target;
      if (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA") return;
      if (el.closest("[data-no-spacer]")) return;

      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.5) return;

      // Estimate keyboard height
      const type = el.getAttribute("type") || "text";
      const compact = type === "tel" || type === "number";
      const estimated = compact ? window.innerHeight * 0.3 : window.innerHeight * 0.45;

      setTimeout(() => adjustForInput(el, estimated), 100);
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
  return <div ref={markerRef} aria-hidden="true" style={{ height: 0, overflow: "hidden" }} />;
}
