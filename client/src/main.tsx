import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./modern.css";

// Preserve incoming links from the old hash router.
const legacyRoutes = ["/", "/quiz"];
const legacyPath = window.location.hash.slice(1);
if (legacyRoutes.includes(legacyPath)) {
  window.history.replaceState(null, "", legacyPath);
}

createRoot(document.getElementById("root")!).render(<App />);
