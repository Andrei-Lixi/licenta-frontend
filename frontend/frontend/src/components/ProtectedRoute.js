import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthToken } from '../hooks/useAuthToken'; // Corect, dacă fișierul e în folderul `hooks`


const ProtectedRoute = ({ children }) => {
  // Verifică dacă utilizatorul este autentificat
  const { token } = useAuthToken(); // Sau în funcție de modul în care verifici statusul autentificării

  // Dacă nu există token (sau alt indicator de autentificare), redirecționează utilizatorul la pagina de login
  if (!token) {
    return <Navigate to="/Register" replace />;
  }

  // Dacă utilizatorul este autentificat, permite accesul la pagina dorită
  return children;
};

export default ProtectedRoute;
