import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";
import ChatProvider from "./context/ChatContext";
import PdfProvider from "./context/PdfContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ChatProvider>
        <PdfProvider>
          <App />
        </PdfProvider>
      </ChatProvider>
    </BrowserRouter>
  </StrictMode>
);