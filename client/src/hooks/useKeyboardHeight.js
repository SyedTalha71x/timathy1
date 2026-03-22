import { useState, useEffect } from "react";

/**
 * Returns the visible viewport height in px, accounting for the iOS keyboard.
 * When the keyboard is closed, returns null (use CSS dvh/vh as normal).
 * When open, returns the actual visible height so popups can shrink above the keyboard.
 */
export default function useKeyboardHeight() {
  const [viewportHeight, setViewportHeight] = useState(null);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    let rafId = null;
    const update = () => {
      // Only apply if keyboard is meaningfully open (viewport shrank by >100px)
      const fullHeight = window.innerHeight;
      const diff = fullHeight - vv.height;
      if (diff > 100) {
        setViewportHeight(vv.height);
      } else {
        setViewportHeight(null);
      }
    };

    const onResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    vv.addEventListener("resize", onResize);
    return () => {
      vv.removeEventListener("resize", onResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return viewportHeight;
}
