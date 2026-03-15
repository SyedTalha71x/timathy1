import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// --- Styles (Reihenfolge wichtig!) ---
import "./index.css";               // Tailwind + @theme tokens
import "./styles/base.css";         // :root Variablen + Resets
import "./styles/fonts.css";        // Font-Klassen (Oxanium, Open Sans)
import "./styles/scrollbars.css";   // Scrollbar Styling
import "./styles/ant-overrides.css"; // Ant Design Overrides
import "./styles/fullcalendar.css"; // FullCalendar Overrides
import "./styles/animations.css";   // Wobble, Drag & Drop

import App from "./App.jsx";
import { store } from "./app/store.js";
import { Provider } from 'react-redux'
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';

// iOS: WebView unterhalb der Statusleiste starten
if (Capacitor.isNativePlatform()) {
  StatusBar.setOverlaysWebView({ overlay: false });
  StatusBar.setStyle({ style: Style.Dark });
  StatusBar.setBackgroundColor({ color: '#141414' }).catch(() => {});
}

// ============================================================================
// iOS: Globaler Keyboard Handler
// ============================================================================
// Problem: resize:"none" + scrollEnabled:false = keine weiße Leiste,
//          aber iOS passt das Layout bei Tastatur-Öffnung nicht an.
// Lösung:  Wir finden automatisch ALLE position:fixed Elemente mit bottom~0
//          und verschieben sie um die Tastaturhöhe nach oben.
//          Keine Änderungen an einzelnen Komponenten nötig.
// ============================================================================
if (Capacitor.getPlatform() === 'ios') {
  Keyboard.addListener('keyboardWillShow', (info) => {
    const kbHeight = info.keyboardHeight

    // Alle fixed-bottom Elemente finden und anpassen
    requestAnimationFrame(() => {
      document.querySelectorAll('*').forEach(el => {
        const cs = getComputedStyle(el)
        if (cs.position === 'fixed') {
          const bottom = parseFloat(cs.bottom)
          if (!isNaN(bottom) && bottom >= 0 && bottom < 20) {
            el.dataset.kbOrigBottom = `${bottom}px`
            el.style.bottom = `${bottom + kbHeight}px`
          }
        }
      })

      // Fokussiertes Eingabefeld in sichtbaren Bereich scrollen
      setTimeout(() => {
        const activeEl = document.activeElement
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) {
          activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 50)
    })
  })

  Keyboard.addListener('keyboardWillHide', () => {
    // Alle angepassten Elemente zurücksetzen
    document.querySelectorAll('[data-kb-orig-bottom]').forEach(el => {
      el.style.bottom = el.dataset.kbOrigBottom
      delete el.dataset.kbOrigBottom
    })

    // Viewport-Reset
    setTimeout(() => {
      window.scrollTo(0, 0)
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    }, 50)
  })
}

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </StrictMode>
    </BrowserRouter>
);
