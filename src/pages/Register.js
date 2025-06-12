import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useAuthToken } from '../hooks/useAuthToken';
import FlashMessage from "../components/FlashMessage";
import '../css/LoginRegister.css';

function LoginRegister() {
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("student"); // default
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
        body: JSON.stringify({ username: email, password }), 
      });

      const data = await response.json();

      if (response.ok) {
        saveToken(data.jwt);
        localStorage.setItem("user", JSON.stringify({ email }));
        navigate("/");
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
      const response = await fetch("/api/public/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, type }),
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <label className="label">Email:</label>
                <div className="input-container">
                  <FaEnvelope className="icon" />
                  <input
                    className="input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

              <div className="input-group">
                <label className="label">Tip utilizator:</label>
                <div className="input-container">
                  <select
                    className="input"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Profesor</option>
                  </select>
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
