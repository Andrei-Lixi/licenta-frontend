import React, { useState } from "react";

const AdminDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [hotelData, setHotelData] = useState({
    name: "",
    stars: "",
    type: "",
    price: "",
    city: "",
    city_id: 1,  // Adăugăm city_id
  });

  const regionToCityId = {
    "Transilvania": 1,
    "Moldova": 2,
    "Muntenia": 3,
    "Banat": 4,
    "Dobrogea": 5,
    "Oltenia": 6,
    "Crisana": 7,
    "Maramures": 8,
    "Bucovina": 9,
  };

  const handleInputChange = (e) => {
    setHotelData({ ...hotelData, [e.target.name]: e.target.value });
  };

  const handleRegionChange = (e) => {
    const selectedRegion = e.target.value;
    setHotelData({
      ...hotelData,
      city: selectedRegion,
      city_id: regionToCityId[selectedRegion], // Setează city_id pe baza regiunii selectate
    });
  };

  const handleSubmit = async () => {
    try {
      const queryParams = new URLSearchParams({
        hotelname: hotelData.name,
        stars: hotelData.stars,
        hoteltype: hotelData.type,
        price: hotelData.price,
        city_id: hotelData.city_id, // Folosește city_id
      }).toString();

      const response = await fetch(`http://localhost:8000/hotels/?${queryParams}`, {
        method: "POST",
      });

      const data = await response.json();
      console.log("Răspuns de la server:", data);

      if (!response.ok) {
        throw new Error(JSON.stringify(data.detail, null, 2));
      }

      console.log("Hotel adăugat cu succes:", data);
      setShowModal(false);
      setHotelData({ name: "", stars: "", type: "", price: "", city: "", city_id: 1 }); // Resetează și city_id

    } catch (error) {
      console.error("Eroare:", error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Rezervările Hotelurilor Tale</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ background: "#f4f4f4" }}>
            <th style={styles.th}>Hotel</th>
            <th style={styles.th}>Regiune</th>
            <th style={styles.th}>De la</th>
            <th style={styles.th}>Până la</th>
            <th style={styles.th}>Nr. persoane</th>
            <th style={styles.th}>Preț total</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="8" style={{ textAlign: "center", padding: "10px" }}>
              Nu există rezervări disponibile.
            </td>
          </tr>
        </tbody>
      </table>

      <h2 style={{ textAlign: "center", marginTop: "40px" }}>Hotelurile Mele</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ background: "#f4f4f4" }}>
            <th style={styles.th}>Nume Hotel</th>
            <th style={styles.th}>Stele</th>
            <th style={styles.th}>Tip</th>
            <th style={styles.th}>Preț/noapte</th>
            <th style={styles.th}>Regiune</th>
            <th style={styles.th}>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
              Nu există hoteluri disponibile.
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={() => setShowModal(true)} style={styles.addButton}>+</button>
      
      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>Adaugă un hotel nou</h3>
            <input name="name" placeholder="Nume Hotel" onChange={handleInputChange} style={styles.input} />
            <input name="stars" placeholder="Stele" onChange={handleInputChange} style={styles.input} />
            <input name="type" placeholder="Tip" onChange={handleInputChange} style={styles.input} />
            <input name="price" placeholder="Preț/noapte" onChange={handleInputChange} style={styles.input} />
            
            {/* Select pentru regiune */}
            <select name="city" value={hotelData.city} onChange={handleRegionChange} style={styles.input}>
              <option value="Transilvania">Transilvania</option>
              <option value="Moldova">Moldova</option>
              <option value="Muntenia">Muntenia</option>
              <option value="Banat">Banat</option>
              <option value="Dobrogea">Dobrogea</option>
              <option value="Oltenia">Oltenia</option>
              <option value="Crisana">Crisana</option>
              <option value="Maramures">Maramures</option>
              <option value="Bucovina">Bucovina</option>
            </select>
            
            <button onClick={handleSubmit} style={styles.saveButton}>Salvează</button>
            <button onClick={() => setShowModal(false)} style={styles.cancelButton}>Anulează</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  th: {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "left",
  },
  addButton: {
    display: "block",
    margin: "20px auto",
    padding: "10px 20px",
    fontSize: "18px",
    cursor: "pointer",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  saveButton: {
    background: "green",
    color: "white",
    padding: "10px 20px",
    border: "none",
    cursor: "pointer",
    marginRight: "10px",
  },
  cancelButton: {
    background: "red",
    color: "white",
    padding: "10px 20px",
    border: "none",
    cursor: "pointer",
  },
};

export default AdminDashboard;
