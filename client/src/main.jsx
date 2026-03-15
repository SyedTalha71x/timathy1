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

// iOS: Keyboard Fix — global für alle Eingabefelder
// Strategie: Bei resize:"none" bleibt der WebView in voller Höhe.
// Wir fügen dem nächsten scrollbaren Container temporär padding-bottom hinzu,
// damit das fokussierte Element über die Tastatur gescrollt werden kann.
if (Capacitor.getPlatform() === 'ios') {
  let paddedElement = null

  // Nächsten scrollbaren Eltern-Container finden
  const findScrollParent = (el) => {
    let parent = el?.parentElement
    while (parent) {
      const style = window.getComputedStyle(parent)
      const overflow = style.overflowY
      if ((overflow === 'auto' || overflow === 'scroll') && parent.scrollHeight > parent.clientHeight) {
        return parent
      }
      parent = parent.parentElement
    }
    return document.documentElement
  }

  Keyboard.addListener('keyboardWillShow', (info) => {
    const kbHeight = info.keyboardHeight
    document.documentElement.style.setProperty('--keyboard-height', `${kbHeight}px`)

    setTimeout(() => {
      const activeEl = document.activeElement
      if (!activeEl || (activeEl.tagName !== 'INPUT' && activeEl.tagName !== 'TEXTAREA' && !activeEl.isContentEditable)) return

      // Temporäres Padding auf den Scroll-Container setzen
      const scrollParent = findScrollParent(activeEl)
      if (scrollParent) {
        paddedElement = scrollParent
        scrollParent.style.paddingBottom = `${kbHeight}px`
      }

      // Element in den sichtbaren Bereich scrollen
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  })

  Keyboard.addListener('keyboardWillHide', () => {
    document.documentElement.style.setProperty('--keyboard-height', '0px')

    // Temporäres Padding entfernen
    if (paddedElement) {
      paddedElement.style.paddingBottom = ''
      paddedElement = null
    }

    setTimeout(() => {
      window.scrollTo(0, 0)
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
      document.body.style.height = '100%'
      requestAnimationFrame(() => { document.body.style.height = '' })
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
