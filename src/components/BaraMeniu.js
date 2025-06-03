import React, { useState, useEffect } from "react";
import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router-dom";
import { useAuthToken } from '../hooks/useAuthToken';

export default function BaraMeniu({ onToggleDarkMode, isDarkMode }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) setIsLoggedIn(true);
  }, []);

  const { removeToken } = useAuthToken(); // extrage din hook

const handleLogout = () => {
  removeToken(); // ⬅️ șterge tokenul și din state și din localStorage
  localStorage.removeItem("user");
  setIsLoggedIn(false);
  navigate("/");
  window.location.reload(); // opțional, dar recomandat pentru reset complet
};



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
              command: onToggleDarkMode, // Activează dark mode în Home
            },
            { label: "Logout", icon: "pi pi-sign-out", command: handleLogout },
          ]
        : [{ label: "Înregistrează-te", icon: "pi pi-user-plus", command: () => navigate("/Register") },
            {
                label: "Dark Mode",
                icon: isDarkMode ? "pi pi-moon" : "pi pi-sun",
                command: onToggleDarkMode, // Activează dark mode în Home
              },
        ],
    },
    {
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
    },
    
    {
      label: "Contact",
      icon: "pi pi-envelope",
      command: () => navigate("/Chat"),
    },
  ];

  return (
    <div className="card">
      <Menubar model={items} />
    </div>
  );
}
