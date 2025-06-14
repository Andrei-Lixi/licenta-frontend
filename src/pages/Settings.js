import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaUser, FaCalendarAlt, FaSchool } from "react-icons/fa";
import { useAuthToken } from "../hooks/useAuthToken";
import FlashMessage from "../components/FlashMessage";
import BaraMeniu from "../components/BaraMeniu";

import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // sau orice temă vrei
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import "../css/Home.css";

function Settings() {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuthToken();

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/me", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data);
      } else {
        setMessage({ type: "danger", text: data.message || "Eroare la încărcarea datelor utilizatorului!" });
      }
    } catch (error) {
      setMessage({ type: "danger", text: "Eroare de rețea!" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchUserData();
    }
  }, [token, navigate]);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      <BaraMeniu onToggleDarkMode={handleToggleDarkMode} isDarkMode={darkMode} />
      <div className="container" style={{
        backgroundImage: 'url(/images/seting.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '2rem'
      }}>
        <h1 className="heading" style={{ color: "#fff", textShadow: "1px 1px 4px #000" }}>Date Personale</h1>

        {message && <FlashMessage type={message.type} message={message.text} />}

        {loading ? (
          <p style={{ color: "#fff" }}>Se încarcă datele...</p>
        ) : userData ? (
          <div className="user-info" style={{
            maxWidth: "600px",
            margin: "0 auto",
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0,0,0,0.4)",
            borderRadius: "10px",
            padding: "1rem"
          }}>
            <Card title={userData.name} subTitle="Profil utilizator" className="mb-3" style={{ color: "white" }}>
              <Panel header="Informații cont" toggleable>
                <div className="p-mb-2">
                  <FaEnvelope style={{ marginRight: '0.5rem' }} />
                  <strong>Email:</strong> {userData.email}
                </div>
                <div className="p-mb-2">
                  <FaUser style={{ marginRight: '0.5rem' }} />
                  <strong>Nume</strong> <Tag severity="info" value={userData.name} />
                </div>
                <div className="p-mb-2">
                  <FaSchool style={{ marginRight: '0.5rem' }} />
                  <strong>Școală:</strong> {userData.school}
                </div>
                
              </Panel>
            </Card>
          </div>
        ) : (
          <p style={{ color: "#fff" }}>Nu s-au găsit date pentru utilizatorul curent.</p>
        )}
      </div>
    </div>
  );
}

export default Settings;
