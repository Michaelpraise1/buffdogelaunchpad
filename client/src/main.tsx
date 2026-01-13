import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SolanaProvider } from "./context/SolanaContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import * as buffer from "buffer";

window.Buffer = buffer.Buffer;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SolanaProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </SolanaProvider>
  </StrictMode>
);
