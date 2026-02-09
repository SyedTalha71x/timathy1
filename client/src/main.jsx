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

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </StrictMode>
    </BrowserRouter>
);
