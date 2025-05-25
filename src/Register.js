import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegUser, FaPhone, FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa"; // Importăm iconițele

function LoginRegister() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
 

  const [isLogin, setIsLogin] = useState(true);

  const [usertype, setUsertype] = useState(null); // Adăugați această linie
const handleChange = (e) => {
      const value = e.target.value;
      setUsertype(value === "client" ? 1 : value === "administrator" ? 2 : null);
    };



    const handleSubmitLogin = async (e) => {
      e.preventDefault();
    
      if (!email || !password) {
        alert("Please enter both email and password.");
        return;
      }
    
      const loginData = new URLSearchParams({
        email: email,
        password: password,
      }).toString();
    
      try {
        const response = await fetch(`http://localhost:8000/login/?${loginData}`, {
          method: "POST",
        });
    
        const rawResponse = await response.text();
        console.log("Raw response:", rawResponse);
    
        let parsedData;
        try {
          parsedData = JSON.parse(rawResponse);
          console.log("Parsed response:", parsedData);
        } catch (error) {
          console.error("Failed to parse JSON:", error);
          throw new Error("Error parsing server response");
        }
    
        if (parsedData.message === "Login successful") {
          console.log("Logged in successfully:", parsedData);
          alert("Login successful!");
    
          // Verificăm usertype și redirecționăm
          if (parsedData.usertype === 2) {
            window.location.href = "/admin-dashboard";  // Redirecționează spre dashboard admin
          } else if (parsedData.usertype === 1) {
            window.location.href = "/map";  // Redirecționează spre pagina client
          }
        } else {
          alert(parsedData.error || "Login failed. Please check your credentials.");
        }
      } catch (error) {
        console.error("Caught Error:", error);
        alert("Error: " + error.message);
      }
    };
      
    
     
    

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    if (usertype === null) { // Verifică dacă nu a fost selectat tipul de utilizator
      alert("Te rugăm să alegi un tip de cont (Client sau Administrator).");
      return; // Oprește execuția funcției pentru a nu trimite datele
    }
    
    

    const userData = {
        username,
        email,
        password,
        usertype,
    };

    console.log("User data sent to server:", userData); // Verifică ce trimitem

    try {
        // Construiți URL-ul cu parametrii query
        const url = new URL("http://localhost:8000/users/");
        Object.keys(userData).forEach(key => url.searchParams.append(key, userData[key]));

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const data = await response.json();

        if (response.ok) {
            console.log("User created successfully:", data);
            alert("Cont creat cu succes!");
            navigate("/map");
        } else {
            console.error("Error:", data);
            if (Array.isArray(data.detail)) {
                data.detail.forEach((error, index) => {
                    console.log(`Error ${index + 1}:`, error);
                });

                const errorMessages = data.detail.map((err) => err.msg || JSON.stringify(err)).join(", ");
                alert("Eroare: " + errorMessages);
            } else if (typeof data.detail === "string") {
                alert("Eroare: " + data.detail);
            } else {
                alert("Eroare: " + JSON.stringify(data.detail));
            }
        }
    } catch (error) {
        console.error("Server error:", error);
        alert("Eroare server!");
    }
};




  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Platforma de Călătorii</h1>

      <div style={formContainerStyle}>
        {isLogin ? (
          <div style={formBoxStyle}>
            <h2 style={loginTitleStyle}>Autentificare</h2>
            <form onSubmit={handleSubmitLogin} style={formStyle}>
            
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Email:</label>
                <div style={inputContainerStyle}>
                  <FaEnvelope style={iconStyle} />
                  <input
                    style={inputStyle}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(String(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Parolă:</label>
                <div style={inputContainerStyle}>
                  <FaLock style={iconStyle} />
                  <input
                    style={inputStyle}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(String(e.target.value))}
                    required
                  />
                </div>
              </div>


              
              
      

              <button type="submit" style={buttonStyle}>Autentifică-te</button>
              <p style={redirectTextStyle}>Nu ai un cont? <span onClick={() => setIsLogin(false)} style={linkStyle}>Înregistrează-te</span></p>
            </form>
            <button onClick={handleGoHome} style={secondaryButtonStyle}>Pagina Principală</button>
          </div>
        ) : (
          <div style={formBoxStyle}>
            <h2 style={registerTitleStyle}>Înregistrare</h2>
            <form onSubmit={handleSubmitRegister} style={formStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Nume:</label>
                <div style={inputContainerStyle}>
                  <FaRegUser style={iconStyle} />
                  <input
                    style={inputStyle}
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(String(e.target.value))}
                    required
                  />
                </div>
              </div>

              

              <div style={inputGroupStyle}>
                 <label style={labelStyle}>Email:</label>
                  <div style={inputContainerStyle}>
                    <FaEnvelope style={iconStyle} />
                    <input
                      style={inputStyle}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(String(e.target.value))} // Asigurăm că e un string
                      required
                    />
                  </div>
                </div>


                <div style={selectContainerStyle}>
                 
                  <div style={inputContainerStyle}>
                    <select
                      onChange={handleChange}
                      style={selectStyle}
                    >
                      <option value="">Selectează tipul contului</option>
                      <option value="administrator">Administrator</option>
                      <option value="client">Client</option>
                    </select>
                    <FaArrowLeft style={selectIconStyle} /> {/* Iconița de săgeată */}
                  </div>
                </div>


              <div style={inputGroupStyle}>
                <label style={labelStyle}>Parolă:</label>
                <div style={inputContainerStyle}>
                  <FaLock style={iconStyle} />
                  <input
                    style={inputStyle}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(String(e.target.value))}
                    required
                  />
                </div>
              </div>

              <button type="submit" style={buttonStyle}>Înregistrează-te</button>
              <p style={redirectTextStyle}>Ai deja un cont? <span onClick={() => setIsLogin(true)} style={linkStyle}>Autentifică-te</span></p>
            </form>
            <button onClick={handleGoHome} style={secondaryButtonStyle}>Pagina Principală</button>
          </div>
        )}
      </div>
    </div>
  );
}

const containerStyle = {
  textAlign: "center",
  padding: "50px",
  backgroundColor: "#f4f7fb",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const headingStyle = {
  fontSize: "2.5rem",
  color: "#2c3e50",
  marginBottom: "20px",
  fontWeight: "700",
};

const loginTitleStyle = {
  fontSize: "2rem",
  color: "#2c3e50",
  marginBottom: "20px",
  fontFamily: "'Roboto', sans-serif", // Aplicați fontul Roboto pe "Autentificare"
  fontWeight: "500",
};

const registerTitleStyle = {
  fontSize: "2rem",
  color: "#2c3e50",
  marginBottom: "20px",
  fontFamily: "'Roboto', sans-serif", // Aplicați fontul Roboto pe "Înregistrare"
  fontWeight: "500",
};

const formContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "40px",
  width: "100%",
  maxWidth: "900px",
  margin: "0 auto",
};

const formBoxStyle = {
  width: "400px",
  padding: "30px",
  borderRadius: "10px",
  backgroundColor: "#fff",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const inputGroupStyle = {
  marginBottom: "20px",
  width: "100%",
};

const labelStyle = {
  display: "block",
  fontSize: "1.1rem",
  color: "#34495e",
  marginBottom: "8px",
  textAlign: "left",
};

const inputContainerStyle = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "8px",
};

const iconStyle = {
  fontSize: "1.2rem",
  color: "#7f8c8d",
  marginRight: "10px",
};

const inputStyle = {
  padding: "12px",
  fontSize: "1rem",
  width: "100%",
  border: "none",
  outline: "none",
};

const buttonStyle = {
  padding: "12px 20px",
  fontSize: "1.1rem",
  cursor: "pointer",
  backgroundColor: "#3498db",
  color: "#fff",
  border: "none",
  borderRadius: "30px",
  width: "100%",
};

const secondaryButtonStyle = {
  padding: "12px 20px",
  fontSize: "1.1rem",
  cursor: "pointer",
  backgroundColor: "#95a5a6",
  color: "#fff",
  border: "none",
  borderRadius: "30px",
  width: "100%",
  marginTop: "15px",
};

const redirectTextStyle = {
  marginTop: "10px",
  fontSize: "1rem",
  color: "#7f8c8d",
};

const linkStyle = {
  color: "#3498db",
  cursor: "pointer",
  textDecoration: "underline",
};



const selectContainerStyle = {
  position: "relative",
  width: "100%",
  marginBottom: "20px",
};

const selectStyle = {
  width: "100%",
  padding: "12px",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "1px solid #ddd",
  outline: "none",
  appearance: "none", // Elimină săgeata implicită a browserului
  backgroundColor: "#f9f9f9", // Culoare fundal
  color: "#34495e", // Culoare text
};

const selectIconStyle = {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: "1.2rem",
  color: "#7f8c8d",
};

export default LoginRegister;
