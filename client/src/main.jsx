import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min"; // Import Bootstrap JS
import App from "./App.jsx";
import "../src/components/AdminPanel/AdminPanel.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
