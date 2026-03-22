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

// iOS: Status bar overlays WebView — header CSS fills behind it
if (Capacitor.isNativePlatform()) {
  StatusBar.setOverlaysWebView({ overlay: true });
  // Dark = light/white icons (for dark backgrounds at startup)
  StatusBar.setStyle({ style: Style.Dark });
}

// ============================================================================
// iOS: Globaler Keyboard Handler
// ============================================================================
// resize:"none" + scrollEnabled:false = keine Leiste.
// Tastatur-Anpassung über ein dynamisches <style>-Tag:
//   → Tailwind-Klasse .fixed.bottom-0 wird global um Tastaturhöhe angehoben
//   → Greift automatisch für ALLE Komponenten ohne Einzelanpassungen
//   → Kein teures DOM-Scanning nötig
// ============================================================================
if (Capacitor.getPlatform() === 'ios') {
  // Style-Tag einmalig erstellen
  const kbStyle = document.createElement('style')
  kbStyle.id = 'capacitor-keyboard-fix'
  document.head.appendChild(kbStyle)

  Keyboard.addListener('keyboardWillShow', (info) => {
    const kb = info.keyboardHeight
    kbStyle.textContent = `.fixed.bottom-0 { bottom: ${kb}px !important; }`
    document.documentElement.style.setProperty('--keyboard-height', `${kb}`)

    // Custom Event — Portale/Dropdowns können darauf reagieren
    window.dispatchEvent(new CustomEvent('capacitor-keyboard', { detail: { height: kb, visible: true } }))
  })

  Keyboard.addListener('keyboardWillHide', () => {
    kbStyle.textContent = ''
    document.documentElement.style.setProperty('--keyboard-height', '0')

    // Custom Event
    window.dispatchEvent(new CustomEvent('capacitor-keyboard', { detail: { height: 0, visible: false } }))
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
