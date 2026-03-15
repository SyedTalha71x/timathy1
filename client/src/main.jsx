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

// iOS: Keyboard Fix — Sicherheitsnetz für Viewport-Reset nach Tastatur-Schließen
// Mit resize:"body" handhabt iOS das Input-Scrolling nativ.
// Dieser Listener verhindert nur den seltenen Fall, dass der Viewport
// nach dem Schließen nicht sauber zurückgesetzt wird.
if (Capacitor.getPlatform() === 'ios') {
  Keyboard.addListener('keyboardWillHide', () => {
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
