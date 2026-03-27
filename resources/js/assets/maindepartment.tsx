import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./department.css";
import { App } from "./department";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
