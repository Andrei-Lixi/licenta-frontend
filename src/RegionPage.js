import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RegionPage = () => {
  const regionNames = {
    1: "Transilvania",
    2: "Moldova",
    3: "Muntenia",
    4: "Banat",
    5: "Dobrogea",
    6: "Oltenia",
    7: "Crisana",
    8: "Maramures",
    9: "Bucovina",
  };
  const { id } = useParams(); // Extrage ID-ul regiunii din URL

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numPersons, setNumPersons] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [reservationConfirmed, setReservationConfirmed] = useState(false);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(`http://localhost:8000/hotels/${id}`);
        if (!response.ok) {
          throw new Error("Nu s-au putut încărca hotelurile.");
        }
        let data = await response.json();

        // Verifică dacă răspunsul nu este un array și transformă-l într-un array
        if (!Array.isArray(data)) {
          if (data && data.HotelID) {
            data = [data]; // Transformă într-un array
          } else {
            data = []; // Dacă nu sunt hoteluri, setăm un array gol
          }
        }
        setHotels(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [id]);

  const handleReservation = (index) => {
    setSelectedHotel(index);
  };

  const handleConfirmReservation = () => {
    const days = (endDate - startDate) / (1000 * 3600 * 24);
    const total = days * numPersons * hotels[selectedHotel].Price;
    setTotalPrice(total);

    // Marchează rezervarea ca fiind confirmată
    setReservationConfirmed(true);
  };

  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      padding: "30px",
      backgroundColor: "#f4f4f4",
      borderRadius: "10px",
      maxWidth: "1200px",
      margin: "auto",
      boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
    },
    title: {
      color: "#333",
      textAlign: "center",
      marginBottom: "20px",
      fontSize: "2.5rem",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    },
    th: {
      padding: "12px 20px",
      backgroundColor: "#007BFF",
      color: "#fff",
      textAlign: "center",
      fontWeight: "bold",
    },
    td: {
      padding: "12px 20px",
      textAlign: "center",
      border: "1px solid #ddd",
    },
    trEven: {
      backgroundColor: "#f9f9f9",
    },
    button: {
      backgroundColor: "#28a745",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "1rem",
      transition: "background-color 0.3s",
    },
    buttonDisabled: {
      backgroundColor: "#dc3545",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "not-allowed",
      fontSize: "1rem",
    },
    modal: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 0 25px rgba(0, 0, 0, 0.2)",
      zIndex: 1000,
      width: "80%",
      maxWidth: "500px",
      transition: "transform 0.3s ease-in-out",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 999,
    },
    input: {
      padding: "10px",
      margin: "10px 0",
      width: "100%",
      borderRadius: "8px",
      border: "1px solid #ddd",
    },
    modalTitle: {
      fontSize: "1.8rem",
      marginBottom: "20px",
      color: "#333",
      textAlign: "center",
    },
    label: {
      fontSize: "1rem",
      marginBottom: "5px",
      display: "block",
      color: "#555",
    },
    priceText: {
      fontSize: "1.2rem",
      fontWeight: "bold",
      marginTop: "15px",
    },
    confirmButton: {
      backgroundColor: "#28a745",
      color: "white",
      padding: "10px 20px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontSize: "1.1rem",
      width: "100%",
      marginTop: "20px",
      transition: "background-color 0.3s",
    },
  };

  if (loading) {
    return <div>Încărcare...</div>;
  }

  if (error) {
    return <div>Eroare: {error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Hoteluri în regiunea {regionNames[id]}</h1>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Nume Hotel</th>
            <th style={styles.th}>⭐ Stele</th>
            <th style={styles.th}>💰 Preț/noapte</th>
            <th style={styles.th}>📅 Disponibilitate</th>
            <th style={styles.th}>✅ Rezervare</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(hotels) && hotels.length > 0 ? (
            hotels.map((hotel, index) => (
              <tr key={index} style={index % 2 === 0 ? styles.trEven : {}}>
                <td style={styles.td}>{hotel.CityID}</td>
                <td style={styles.td}>{"⭐".repeat(hotel.Stars)}</td>
                <td style={styles.td}>{hotel.Price} Lei</td>
                <td style={styles.td}>Disponibil</td>
                <td style={styles.td}>
                  <button
                    style={reservationConfirmed ? { ...styles.button, backgroundColor: '#dc3545' } : styles.button}
                    disabled={reservationConfirmed}
                    onClick={() => handleReservation(index)}
                  >
                    {reservationConfirmed ? "Rezervat" : "Rezervă acum"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={styles.td}>
                Nu există hoteluri disponibile.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedHotel !== null && (
        <>
          <div style={styles.modalOverlay} onClick={() => setSelectedHotel(null)}></div>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Completează detaliile rezervării</h2>
            <div>
              <label style={styles.label}>Check-in:</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="dd/MM/yyyy"
                placeholderText="Selectează data"
                minDate={new Date()}
                style={styles.input}
              />
            </div>
            <div>
              <label style={styles.label}>Check-out:</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                dateFormat="dd/MM/yyyy"
                placeholderText="Selectează data"
                style={styles.input}
              />
            </div>
            <div>
              <label style={styles.label}>Număr persoane:</label>
              <input
                type="number"
                min="1"
                value={numPersons}
                onChange={(e) => setNumPersons(e.target.value)}
                style={styles.input}
              />
            </div>
            <div>
              <p style={styles.priceText}>
                <strong>Preț total:</strong> {totalPrice} Lei
              </p>
            </div>
            {!reservationConfirmed ? (
              <button
                onClick={handleConfirmReservation}
                style={styles.confirmButton}
              >
                Confirmă rezervarea
              </button>
            ) : (
              <p style={{ color: "green", textAlign: "center" }}>
                Rezervarea s-a realizat cu succes!
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RegionPage;
