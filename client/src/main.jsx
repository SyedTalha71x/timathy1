import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import "./App.css";
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
