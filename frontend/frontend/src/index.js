import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./components/AppRouter"; // Importă AppRouter pentru rutele protejate
import 'primereact/resources/themes/lara-light-blue/theme.css';  // Tema UI
import 'primereact/resources/primereact.min.css';  // Stilurile PrimeReact
import 'primeicons/primeicons.css'; // Iconițele PrimeIcons


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);