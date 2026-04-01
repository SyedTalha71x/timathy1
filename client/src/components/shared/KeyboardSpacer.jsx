import { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";

/**
 * KeyboardSpacer
 *
 * Calculates the MINIMUM padding needed to scroll the focused input
 * into the visible area above the keyboard.
 *
 * Uses the input's parent card/wrapper for positioning so the full
 * context (label, card padding) stays visible — not just the input.
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
   * Find the visual "card" wrapper around the input.
   * Walks up max 5 levels looking for a rounded container with padding.
   * Falls back to the input itself if nothing found.
   */
  const findCardWrapper = (input, scrollContainer) => {
    let node = input.parentElement;
    let levels = 0;
    while (node && node !== scrollContainer && levels < 5) {
      const style = window.getComputedStyle(node);
      const hasPadding = parseFloat(style.padding) > 8 || parseFloat(style.paddingTop) > 8;
      const hasRounding = parseFloat(style.borderRadius) > 4;
      if (hasPadding && hasRounding) return node;
      node = node.parentElement;
      levels++;
    }
    return input;
  };

  const adjustForInput = (input, keyboardHeight) => {
    const container = getContainer();
    if (!container || !input) return;

    if (originalPaddingRef.current === null) {
      originalPaddingRef.current = container.style.paddingBottom || "";
    }

    // Use the card wrapper for positioning, not just the tiny input
    const target = findCardWrapper(input, container);
    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    // Visible area above the keyboard
    const keyboardTop = window.innerHeight - keyboardHeight;
    const visibleTop = containerRect.top;
    const visibleHeight = Math.max(0, keyboardTop - visibleTop);

    // We want the bottom of the target card to be well above the keyboard
    const buffer = 40;
    const targetBottom = targetRect.bottom;
    const safeZone = keyboardTop - buffer;

    // How far we need to scroll up
    const scrollNeeded = targetBottom - safeZone;

    if (scrollNeeded <= 0) {
      // Already fully visible
      container.style.paddingBottom = originalPaddingRef.current || "";
      return;
    }

    // Can we scroll that far with existing content?
    const maxScroll = container.scrollHeight - container.clientHeight;
    const currentScroll = container.scrollTop;
    const scrollRoom = maxScroll - currentScroll;

    // Only pad the deficit
    const deficit = Math.max(0, scrollNeeded - scrollRoom);
    if (deficit > 0) {
      container.style.paddingBottom = `${deficit + buffer}px`;
    }

    // Scroll after padding is applied
    requestAnimationFrame(() => {
      container.scrollBy({ top: scrollNeeded, behavior: "smooth" });
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
