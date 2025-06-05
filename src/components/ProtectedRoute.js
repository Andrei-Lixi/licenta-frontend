import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthToken } from '../hooks/useAuthToken';

const ProtectedRoute = ({ children }) => {
  const { token, getRol } = useAuthToken();

  if (!token) {
    // Dacă nu e autentificat, redirecționează la Register
    return <Navigate to="/Register" replace />;
  }

  const roleFromToken = getRol();
  const role = Array.isArray(roleFromToken) ? roleFromToken[0] : roleFromToken;

  if (role !== "ROLE_ADMIN") {
    // Dacă nu este admin, redirecționează la pagina de acces interzis
    return <Navigate to="/access-denied" replace />;
  }

  // Dacă e admin, afișează conținutul protejat
  return children;
};

export default ProtectedRoute;
