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

// iOS: Keyboard Handling — steuert App-Höhe über CSS-Variable
// scrollEnabled:false + resize:"none" = Leiste weg, aber iOS passt Layout nicht an.
// Wir setzen --app-height auf #root, damit die gesamte App über der Tastatur bleibt.
if (Capacitor.getPlatform() === 'ios') {
  Keyboard.addListener('keyboardWillShow', (info) => {
    const kbHeight = info.keyboardHeight
    const root = document.getElementById('root')
    document.documentElement.style.setProperty('--app-height', `calc(100dvh - ${kbHeight}px)`)
    if (root) root.style.overflow = 'hidden'

    // Fokussiertes Element in den sichtbaren Bereich scrollen
    setTimeout(() => {
      const activeEl = document.activeElement
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 150)
  })

  Keyboard.addListener('keyboardWillHide', () => {
    const root = document.getElementById('root')
    document.documentElement.style.removeProperty('--app-height')
    if (root) root.style.overflow = ''

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
