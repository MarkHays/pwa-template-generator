import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Simple console logging for development
console.log("PWA Generator App starting...");

// Error handling
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});

// Render the app
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

console.log("PWA Generator App rendered successfully");
