import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaUser, FaSchool } from "react-icons/fa";
import { useAuthToken } from "../hooks/useAuthToken";
import FlashMessage from "../components/FlashMessage";
import BaraMeniu from "../components/BaraMeniu";

import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';

import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import "../css/Home.css";

function Settings() {
  const [userData, setUserData] = useState(null);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [message, setMessage] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingAttempts, setLoadingAttempts] = useState(true);
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
      setLoadingUser(false);
    }
  };

  const fetchQuizAttempts = async () => {
    try {
      const response = await fetch("/api/quiz/attempts", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        setQuizAttempts(data);
      } else {
        setMessage({ type: "danger", text: data.message || "Eroare la încărcarea testelor făcute!" });
      }
    } catch (error) {
      setMessage({ type: "danger", text: "Eroare de rețea la încărcarea testelor!" });
    } finally {
      setLoadingAttempts(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchUserData();
      fetchQuizAttempts();
    }
  }, [token, navigate]);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      <BaraMeniu onToggleDarkMode={handleToggleDarkMode} isDarkMode={darkMode} />
      <div
        className="container"
        style={{
          backgroundImage: 'url(/images/seting.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          padding: '2rem'
        }}
      >
        <h1 className="heading" style={{ color: "#fff", textShadow: "1px 1px 4px #000" }}>Date Personale</h1>

        {message && <FlashMessage type={message.type} message={message.text} />}

        {loadingUser ? (
          <p style={{ color: "#fff" }}>Se încarcă datele...</p>
        ) : userData ? (
          <div
            className="user-info"
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(0,0,0,0.4)",
              borderRadius: "10px",
              padding: "1rem"
            }}
          >
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

        <h2 className="heading" style={{ color: "#fff", marginTop: '3rem', textShadow: "1px 1px 4px #000" }}>
          Testele efectuate
        </h2>

        {loadingAttempts ? (
          <p style={{ color: "#fff" }}>Se încarcă testele făcute...</p>
        ) : quizAttempts.length === 0 ? (
          <p style={{ color: "#fff" }}>Nu ai efectuat niciun test încă.</p>
        ) : (
          <div
  className="quiz-attempts-list"
  style={{
    maxWidth: '900px',
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    justifyContent: 'center',
  }}
>
  {quizAttempts.map((attempt) => (
    <Card
      key={attempt.attemptId}
      title={attempt.quizTitle}
      className="p-shadow-4"
      style={{
        backgroundColor: 'rgba(255,255,255,0.1)',
        color: '#f0f0f0',
        borderRadius: '12px',
        padding: '1rem',
        flex: '1 1 calc(33.33% - 1rem)',  // fiecare card ia ~1/3 din lățime minus gap
        minWidth: '250px',                 // să nu fie prea mic pe ecrane mari
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <Tag severity="success" value={`✔ Corecte: ${attempt.correctAnswers}`} rounded style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }} />
        <Tag severity="info" value={`📋 Total: ${attempt.totalQuestions}`} rounded style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }} />
        <Tag severity={attempt.scorePercent === 100 ? "success" : "warning"} value={`📊 Scor: ${attempt.scorePercent}%`} rounded style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }} />
      </div>

      <ProgressBar
        value={attempt.scorePercent}
        showValue={false}
        style={{
          height: '14px',
          borderRadius: '10px',
          backgroundColor: 'rgba(255,255,255,0.2)'
        }}
        className="progressbar-custom"
      />

      {attempt.attemptedAt && (
        <p style={{ marginTop: '0.75rem', color: '#ccc', fontStyle: 'italic', fontSize: '0.8rem' }}>
          Data efectuării: {attempt.attemptedAt}
        </p>
      )}
    </Card>
  ))}
</div>

        )}
      </div>
    </div>
  );
}

export default Settings;
