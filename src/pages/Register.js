import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegUser, FaPhone, FaEnvelope, FaLock } from "react-icons/fa"; 
import { useAuthToken } from '../hooks/useAuthToken';
import FlashMessage from "../components/FlashMessage";
import '../css/LoginRegister.css';

function LoginRegister() {
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const { saveToken } = useAuthToken();

  
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        saveToken(data.jwt);
        localStorage.setItem("user", JSON.stringify({ username })); // Salvăm userul
        navigate("/"); // Navigăm către Contul Meu
      } else {
        setMessage({ type: "danger", text: "Eroare de autentificare!" });
      }
    } catch (error) {
      setMessage({ type: "danger", text: "Eroare de rețea!" });
    }
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, phone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/");
      } else {
        alert(data.message || "Eroare la înregistrare!");
      }
    } catch (error) {
      alert("Eroare de rețea!");
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="container">
      <h1 className="heading">Platforma de cont</h1>

      <div className="form-container">
        {message && <FlashMessage type={message.type} message={message.text} />}
        {isLogin ? (
          <div className="form-box">
            <h2 className="form-title">Autentificare</h2>
            <form onSubmit={handleSubmitLogin} className="form">
              <div className="input-group">
                <label className="label">Email:</label>
                <div className="input-container">
                  <FaEnvelope className="icon" />
                  <input
                    className="input"
                    type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="label">Parolă:</label>
                <div className="input-container">
                  <FaLock className="icon" />
                  <input
                    className="input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="button">Autentifică-te</button>
              <p className="redirect-text">Nu ai un cont? <span onClick={() => setIsLogin(false)} className="link">Înregistrează-te</span></p>
            </form>
            <button onClick={handleGoHome} className="secondary-button">Pagina Principală</button>
          </div>
        ) : (
          <div className="form-box">
            <h2 className="form-title">Înregistrare</h2>
            <form onSubmit={handleSubmitRegister} className="form">
              <div className="input-group">
                <label className="label">Nume:</label>
                <div className="input-container">
                  <FaRegUser className="icon" />
                  <input
                    className="input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="label">Număr de telefon:</label>
                <div className="input-container">
                  <FaPhone className="icon" />
                  <input
                    className="input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="ex. 0712345678"
                    pattern="^[0-9]{10}$"
                    title="Numărul de telefon trebuie să aibă exact 10 caractere."
                    maxLength="10"
                  />
                </div>
              </div>

              <button type="submit" className="button">Înregistrează-te</button>
              <p className="redirect-text">Ai deja un cont? <span onClick={() => setIsLogin(true)} className="link">Autentifică-te</span></p>
            </form>
            <button onClick={handleGoHome} className="secondary-button">Pagina Principală</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginRegister;
