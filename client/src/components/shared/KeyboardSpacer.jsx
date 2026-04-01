import { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";

/**
 * KeyboardSpacer
 *
 * Adds paddingBottom to the parent scroll container when the keyboard opens,
 * then scrolls the focused input into the visible area.
 *
 * The added padding sits behind the keyboard — invisible while typing.
 *
 * Native: Uses @capacitor/keyboard for exact keyboard height.
 * Web:    Uses focusin/focusout with estimated heights.
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

  const setPadding = (value) => {
    const c = getContainer();
    if (!c) return;
    if (originalPaddingRef.current === null) {
      originalPaddingRef.current = c.style.paddingBottom || "";
    }
    c.style.paddingBottom = value;
  };

  const resetPadding = () => {
    const c = getContainer();
    if (!c || originalPaddingRef.current === null) return;
    c.style.paddingBottom = originalPaddingRef.current;
    originalPaddingRef.current = null;
  };

  const scrollToInput = (el, delay = 300) => {
    if (!el) return;
    setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, delay);
  };

  // ════════════════════════════════════════════
  // Native: Capacitor Keyboard plugin
  // ════════════════════════════════════════════
  useEffect(() => {
    if (!isNative || !isMobile) return;

    let showListener;
    let hideListener;

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

        setPadding(`${info.keyboardHeight}px`);
        scrollToInput(el, 100);
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
      setPadding(compact ? "30vh" : "45vh");
      scrollToInput(el);
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
