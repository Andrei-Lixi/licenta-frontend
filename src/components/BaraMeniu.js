import React, { useState, useEffect } from "react";
import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router-dom";
import { useAuthToken } from '../hooks/useAuthToken';

export default function BaraMeniu({ onToggleDarkMode, isDarkMode }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { getRol, removeToken } = useAuthToken();

  const [role, setRole] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
      const roleFromToken = getRol();
      const rolCurent = Array.isArray(roleFromToken) ? roleFromToken[0] : roleFromToken;
      setRole(rolCurent);
    }
  }, [getRol]);

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
    window.location.reload();
  };

  // Meniul de baza
  const items = [
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => navigate("/"),
    },
    {
      label: "Contul meu",
      icon: "pi pi-user",
      items: isLoggedIn
        ? [
            { label: "Setări", icon: "pi pi-cog", command: () => navigate("/Settings") },
            {
              label: "Dark Mode",
              icon: isDarkMode ? "pi pi-moon" : "pi pi-sun",
              command: onToggleDarkMode,
            },
            { label: "Logout", icon: "pi pi-sign-out", command: handleLogout },
          ]
        : [
            { label: "Înregistrează-te", icon: "pi pi-user-plus", command: () => navigate("/Register") },
            {
              label: "Dark Mode",
              icon: isDarkMode ? "pi pi-moon" : "pi pi-sun",
              command: onToggleDarkMode,
            },
          ],
    },
    {
      label: "Contact",
      icon: "pi pi-envelope",
      command: () => navigate("/ChatPage"),
    },
  ];

  // Dacă utilizatorul e admin, adaugă butonul Admin și nu afișa Lectii
  if (role === "ROLE_ADMIN") {
    items.push({
      label: "Admin",
      icon: "pi pi-lock",
      command: () => navigate("/Admin"),
    });
  } else {
    // Pentru toți ceilalți utilizatori, adaugă butonul Lectii
    items.push({
      label: "Lectii",
      icon: "pi pi-search",
      items: [
        {
          label: "Demo",
          icon: "pi pi-server",
          items: [
            {
              label: "Lectie",
              icon: "pi pi-palette",
              command: () => navigate("/CoursePage", { state: { acces: "demo" } }),
            },
            {
              label: "Quiz",
              icon: "pi pi-palette",
              command: () => navigate("/QuizPage"),
            },
          ],
        },
      ],
    });
  }

  return (
    <div className="card">
      <Menubar model={items} />
    </div>
  );
}
