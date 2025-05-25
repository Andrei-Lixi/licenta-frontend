// src/components/AppRouter.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home"; // Componenta pentru pagina principala
import Register from "../pages/Register"; // Componenta pentru înregistrare
import QuizPage from '../pages/QuizPage';
import MapPage from "./MapPage"; // Componenta pentru harta
import ProtectedRoute from "./ProtectedRoute"; // Componenta care protejează rutele
import CoursePage from '../pages/CoursePage';
import Settings from '../pages/Settings';
import ChatPage from '../pages/Chat';



function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Ruta de login, accesibilă tuturor */}
        <Route path="/" element={<Home />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/QuizPage" element={<QuizPage />} />
        <Route path="/CoursePage" element={<CoursePage />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/Chat" element={<ChatPage />} />
        {/* Ruta protejată pentru utilizatorii autentificați */}
        <Route
          path="/map"
          element={
            <ProtectedRoute>
            <MapPage />
          </ProtectedRoute>
          }
        />
        {/* Dacă nu vrei ca ruta de login să fie protejată, o poți păstra ca fiind publică */}
      </Routes>
    </Router>
  );
}

export default AppRouter;
