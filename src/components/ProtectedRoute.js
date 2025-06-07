import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuthToken } from '../hooks/useAuthToken';

const ProtectedRoute = ({ children }) => {
  const { token, getRol } = useAuthToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/Register" replace />;
  }

  const roleFromToken = getRol();
  const role = Array.isArray(roleFromToken) ? roleFromToken[0] : roleFromToken;

  const path = location.pathname.toLowerCase();

  if (path === "/admin" && role !== "ROLE_ADMIN") {
    return <Navigate to="/access-denied" replace />;
  }

  if (path === "/coursepage" && role !== "ROLE_TEACHER" && role !== "ROLE_USER") {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

export default ProtectedRoute;
