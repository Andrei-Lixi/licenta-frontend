import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function LoginRegister() {
  const [isHovered, setIsHovered] = useState(false); // Starea pentru hover

  useEffect(() => {
    // Adăugăm stiluri CSS dinamice pentru animație
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(`
      @keyframes backgroundAnimation {
        0% { background: linear-gradient(45deg, #3498db, #8e44ad); }
        50% { background: linear-gradient(45deg, #2ecc71, #f39c12); }
        100% { background: linear-gradient(45deg, #9b59b6, #1abc9c); }
      }
    `, styleSheet.cssRules.length);

    styleSheet.insertRule(`
      body {
        animation: backgroundAnimation 10s infinite alternate;
      }
    `, styleSheet.cssRules.length);
  }, []);

  // Stilul butonului cu efecte de hover
  const buttonStyle = (isHovered) => ({
    padding: '12px 25px',
    fontSize: '18px',
    cursor: 'pointer',
    background: isHovered
      ? 'linear-gradient(45deg, #f39c12, #2ecc71)' // Schimbă culorile când hover-ul este activ
      : 'linear-gradient(45deg, #3498db, #8e44ad)', // Culoarea default
    color: '#fff',
    border: 'none',
    borderRadius: '30px',
    transition: 'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
    width: '250px',
    boxShadow: isHovered
      ? '0 8px 16px rgba(0, 0, 0, 0.15)' // Umbră mai puternică la hover
      : '0 4px 8px rgba(0, 0, 0, 0.1)', // Umbră subtilă
    transform: isHovered ? 'scale(1.05)' : 'scale(1)', // Mărire la hover
    outline: 'none',
  });

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Bine ați venit pe platforma noastră de călătorii!</h1>
      <p style={introTextStyle}>Alegeți una dintre opțiunile de mai jos pentru a începe:</p>

      {/* Link către pagina de înregistrare */}
      <div style={buttonContainerStyle}>
        <Link to="/register" style={linkStyle}>
          <button
            style={buttonStyle(isHovered)}
            onMouseEnter={() => setIsHovered(true)}  // Activăm hover-ul
            onMouseLeave={() => setIsHovered(false)} // Dezactivăm hover-ul
          >
            Conectare
          </button>
        </Link>
      </div>

      
      

      <section style={aboutSectionStyle}>
        <h2 style={sectionHeadingStyle}>Despre Noi</h2>
        <p style={sectionTextStyle}>
          Suntem aici pentru a te ajuta să îți planifici călătoria ideală! Dacă nu ești sigur unde vrei să mergi, explorează harta noastră interactivă sau creează un cont pentru a primi recomandări personalizate.
        </p>
      </section>
    </div>
  );
}

// Stiluri pentru fiecare componentă
const containerStyle = {
  textAlign: 'center',
  padding: '30px',
  backgroundColor: '#f4f7fb',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const headingStyle = {
  fontSize: '2.5rem',
  color: '#2c3e50',
  marginBottom: '15px',
};

const introTextStyle = {
  fontSize: '1.2rem',
  color: '#34495e',
  marginBottom: '40px',
};

const buttonContainerStyle = {
  margin: '15px 0',
};

const linkStyle = {
  textDecoration: 'none',
};

const aboutSectionStyle = {
  marginTop: '40px',
  border: '1px solid #ddd',
  padding: '30px',
  borderRadius: '8px',
  backgroundColor: '#fff',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
};

const sectionHeadingStyle = {
  fontSize: '1.8rem',
  color: '#2c3e50',
  marginBottom: '20px',
};

const sectionTextStyle = {
  fontSize: '1rem',
  color: '#7f8c8d',
  lineHeight: '1.6',
};

export default LoginRegister;
