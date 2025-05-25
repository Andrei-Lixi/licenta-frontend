import React, { useState, useEffect } from "react";
import BaraMeniu from "../components/BaraMeniu";
import "../css/Home.css"; // Importă fișierul CSS

function Home() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  // Aplica dark mode la încărcare
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // Funcția pentru schimbarea modului
  const handleToggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      <BaraMeniu onToggleDarkMode={handleToggleDarkMode} isDarkMode={darkMode} />
      <h1 className="heading">Bine ați venit pe platforma noastră de meditații!</h1>
      <p className="intro-text"></p>

      <section className="about-section">
        <h2 className="section-heading">Despre Noi</h2>
        <p className="section-text">
          Suntem aici pentru a te ajuta să îți planifici călătoria ideală spre cunoaștere! Dacă nu ești sigur de această pagină, explorează cursurile noastre demo sau creează un cont pentru a primi recomandări personalizate.
        </p>
      </section>
    </div>
  );
}

export default Home;
