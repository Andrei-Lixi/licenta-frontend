import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaUser, FaCalendarAlt } from "react-icons/fa";
import { useAuthToken } from "../hooks/useAuthToken"; // Hook pentru gestionarea token-ului
import FlashMessage from "../components/FlashMessage";
import "../css/Home.css";
import BaraMeniu from "../components/BaraMeniu";

function Settings() {
  const [userData, setUserData] = useState(null); // Datele utilizatorului
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true); // Stare pentru a gestiona încărcarea datelor
  const [darkMode, setDarkMode] = useState(false); // Starea pentru dark mode
  const navigate = useNavigate();
  const { token } = useAuthToken(); // Token-ul utilizatorului din hook

  // Funcție pentru a obține datele utilizatorului de la endpoint-ul /api/me
  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/me", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }, // Trimiterea tokenului pentru autentificare
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data); // Setăm datele utilizatorului
      } else {
        setMessage({ type: "danger", text: data.message || "Eroare la încărcarea datelor utilizatorului!" });
      }
    } catch (error) {
      setMessage({ type: "danger", text: "Eroare de rețea!" });
    } finally {
      setLoading(false); // Indiferent de rezultat, oprește încărcarea
    }
  };

  // Încărcăm datele utilizatorului la montarea componentei
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchUserData();
    }
  }, [token, navigate]);

  // Funcția pentru a schimba starea dark mode
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      {/* Bara de meniu plasată aici */}
      <BaraMeniu onToggleDarkMode={handleToggleDarkMode} isDarkMode={darkMode} />
      <br></br>
      <div className="container">
        <h1 className="heading">Setările contului</h1>

        {message && <FlashMessage type={message.type} message={message.text} />}

        {loading ? (
          <p>Se încarcă datele...</p> // Mesaj de încărcare până când datele sunt disponibile
        ) : userData ? (
          <div className="user-info p-mt-3">
            <div className="info-item p-d-flex p-jc-start p-ai-center p-mb-3">
              <FaEnvelope className="icon" />
              <span className="p-ml-2">Email: {userData.email}</span>
            </div>
            <div className="info-item p-d-flex p-jc-start p-ai-center p-mb-3">
              <FaUser className="icon" />
              <span className="p-ml-2">Tip cont: {userData.accountType}</span>
            </div>
            <div className="info-item p-d-flex p-jc-start p-ai-center p-mb-3">
              <FaCalendarAlt className="icon" />
              <span className="p-ml-2">
                Cont creat pe: {new Date(userData.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ) : (
          <p>Nu s-au găsit date pentru utilizatorul curent.</p>
        )}
      </div>
    </div>
  );
}

export default Settings;
