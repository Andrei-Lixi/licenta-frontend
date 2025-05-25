import React, { useState } from "react";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const navLinkStyle = {
  color: "#ffffff",
  padding: "10px 15px",
  transition: "0.3s",
};

const dropdownStyle = {
  fontSize: "1.1rem",
};

const dropdownItemStyle = {
  padding: "12px 20px",
  fontSize: "1rem",
  color: "#333",
  transition: "0.3s",
};

const logoutStyle = {
  padding: "12px 20px",
  fontSize: "1rem",
  color: "#dc3545", // Roșu pentru logout
  fontWeight: "bold",
  transition: "0.3s",
};

const dropdownHoverStyle = {
  backgroundColor: "#f8f9fa", // Gri deschis pe hover
};


const regions = [
  {
    id: 1,
    name: "Transilvania",
    coordinates: [
      [46, 22.5], [47.4, 22.7], [47.5, 25], [47.0, 25.0], [47.2, 25.61], 
      [46.5, 25.7], [46.3, 26.5], [45.5, 25.9], [45.5, 25], [45.4, 22.8]
    ],
    description: "Transilvania este o regiune montană din centrul României, cunoscută pentru peisajele sale montane, cetăți medievale și tradiții."
  },
  {
    id: 2,
    name: "Moldova",
    coordinates: [
      [46.31, 26.6], [45.5, 26], [45.5, 28.1],[46.9,28.15], [47.6, 27.4], [47.5, 27.2],
      [47.5, 27.2], [47.4, 26.5], [47.2, 25.65], [46.5, 25.8],
    ],
    description: "Moldova este o regiune din estul României, cunoscută pentru tradițiile sale și bisericile medievale."
  },
  {
    id: 3,
    name: "Muntenia",
    coordinates: [
      [43.7, 24.7], [44.1, 27.5], [45.3, 28.4], [45.4, 28.2], [45.4, 27.6],
      [45.45, 24.5], [45, 24.6], [45, 25], [45, 24.9], [45, 24.6]
    ],
    description: "Muntenia este o regiune din sudul României, cu o istorie bogată și tradiții legate de viața rurală."
  },
  {
    id: 4,
    name: "Banat",
    coordinates: [
      [46.1, 20.2], [46.2, 21], [45.9, 21.6], [46.0, 22.5], [45, 22.7], [44.7, 22.5], 
      [44.7, 22],[44.7, 21.6], [45.1, 21.5], [45.2, 21.4]
    ],
    description: "Banatul este o regiune situată în vestul României, cunoscută pentru diversitatea culturală și tradițiile sale culinare."
  },
  {
    id: 5,
    name: "Dobrogea",
    coordinates: [
      [43.8, 28.6], [44.4, 28.6], [44.3, 28.8], [45.2, 29.8], [45.4, 29.4], [45.2, 28.4],
      [44.7, 28], [44, 27.5], [43.8, 28.2]
    ],
    description: "Dobrogea este o regiune din sud-estul României, cunoscută pentru peisajele sale de litoral și tradițiile grecești."
  },
  {
    id: 6,
    name: "Oltenia",
    coordinates: [
      [45.35, 22.8], [45.45, 24.5], [44.1, 24.8], [43.75, 24.7], [43.8, 23],
      [43.8, 23], [44.1, 23.1], [44.3, 22.53]
    ],
    description: "Oltenia este o regiune din sudul României, cu o tradiție agricolă veche și peisaje deosebite."
  },
  {
    id: 7,
    name: "Crișana",
    coordinates: [
      [46, 21.4], [46, 22.5], [47.4, 22.6], [47.4, 22.1], [46.9, 21.6],
      [46.7, 21.4], [46.5, 21.2]
    ],
    description: "Crișana este o regiune din vestul României, cu o istorie bogată și o diversitate culturală."
  },
  {
    id: 8,
    name: "Maramureș",
    coordinates: [
      [47.4, 22.05],[47.7, 22.3], [48.05, 23.1], [47.9, 24.0], [47.7, 25], [47.5, 25],
       [47.5, 24.3]
    ],
    description: "Maramureș este o regiune din nord-vestul României, cunoscută pentru tradițiile sale rurale și bisericile de lemn."
  },
  
  {
    id: 9,
    name: "Bucovina",
    coordinates: [
      [47.3, 25],[47.7, 25],[48, 26.1],[48.25, 26.8],[48, 27.1], [47.55, 27.3],  [47.3, 26]
    ,[47.1, 25]
    ],
    description: "Bucovina este o regiune montană din nord-estul României, cunoscută pentru mănăstirile sale UNESCO."
  }
];

function App() {
  

  const [selectedRegion, setSelectedRegion] = useState(null);
  const navigate = useNavigate();

  const handleRegionClick = (region) => {
    setSelectedRegion(region); 
    navigate(`/region/${region.id}`); 
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
    gap: "20px",
    backgroundColor: "#f4f4f4",
    height: "100vh",
  };

  const mapContainerStyle = {
    width: "45%",
    height: "400px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const descriptionContainerStyle = {
    width: "50%",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    color: "#555",
  };

  const h2Style = {
    color: "#0056b3",
  };

  const sectionStyle = {
    marginTop: "20px",
  };

  const h3Style = {
    color: "#0056b3",
    fontSize: "1.2em",
  };

  const ulStyle = {
    listStyle: "none",
    padding: "0",
  };

  const liStyle = {
    marginBottom: "10px",
    fontSize: "1em",
  };

  const selectedRegionStyle = {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  return (
    
    <div className="App" style={{ fontFamily: "'Arial', sans-serif", margin: 0, padding: 0 }}>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="w-100 d-flex justify-content-between" style={{ fontSize: "1.25rem", fontWeight: "normal" }}>
          <NavDropdown title="Contul meu" id="basic-nav-dropdown" style={dropdownStyle}>
              <NavDropdown.Item as={Link} to="#rezervarile-mele" style={dropdownItemStyle}>
                Rezervările mele
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="#date-personale" style={dropdownItemStyle}>
                Date personale
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/" style={logoutStyle}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
            
            <Navbar.Brand href="/" style={navLinkStyle}>Regiunile României</Navbar.Brand>
            <Nav.Link as={Link} to="#rezervari" style={navLinkStyle}>Rezervări</Nav.Link>
            <Nav.Link as={Link} to="#quiz" style={navLinkStyle}>Quiz</Nav.Link>



          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div style={containerStyle}>
        
        {/* Harta */}
        <div style={mapContainerStyle}>
        <MapContainer 
            center={[45.9432, 24.9668]} // Centru României
            zoom={6.5} 
            minZoom={6.5} 
            maxZoom={6} 
            style={{ height: "100%" }}
            zoomControl={false}
            maxBounds={[
              [43.5, 20.5], // Limită sud-vest - La sud de România, pentru a exclude Serbia
              [48.5, 30.5], // Limită nord-est - Până la granița cu Ucraina
            ]}
            maxBoundsViscosity={1.0} // Restricționează pan-ul pe România
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {regions.map((region) => (
              <Polygon
                key={region.id}
                positions={region.coordinates}
                pathOptions={{
                  color: "transparent",
                  fillColor: "transparent",
                  fillOpacity: 0,
                  weight: 2
                }}
                eventHandlers={{
                  
                  click: () => handleRegionClick(region)
                  
                  
                }}
              >
                <Popup>{region.name}</Popup>
              </Polygon>
            ))}
          </MapContainer>

         
        </div>
  
        {/* Secțiune de descriere și informații */}
        <div style={descriptionContainerStyle}>
          <h2 style={h2Style}>Explorează Regiunile României</h2>
          <p><strong>Click pe o regiune de pe hartă</strong> pentru a afla mai multe despre cultura, tradițiile și peisajele acelei zone!</p>

          <section style={sectionStyle}>
            <h3 style={h3Style}>Curiozități despre regiunile României</h3>
            <ul style={ulStyle}>
              <li style={liStyle}><strong>Transilvania:</strong> Este casa multor legende, inclusiv a faimosului Dracula!</li>
              <li style={liStyle}><strong>Moldova:</strong> Este renumită pentru tradițiile sale unice și bisericile vechi din lemn.</li>
              <li style={liStyle}><strong>Muntenia:</strong> Oferă o combinație de istorie și peisaje montane incredibile.</li>
              <li style={liStyle}><strong>Banat:</strong> Este o regiune multiculturală cu tradiții și influențe din mai multe culturi.</li>
              <li style={liStyle}><strong>Dobrogea:</strong> este cunoscută pentru diversitatea sa etnică și culturală, având o importantă influență a tradițiilor grecești și turcești.</li>
              <li style={liStyle}><strong>Oltenia:</strong> este locul unde se află celebra mănăstire Hurezi, un loc de cult UNESCO, care reprezintă un exemplu de arhitectură medievală românească.</li>
              <li style={liStyle}><strong>Crișana:</strong> este o regiune plină de istorie, cu influențe din Imperiul Austro-Ungar</li>
              <li style={liStyle}><strong>Maramureș:</strong> este și locul în care tradițiile și obiceiurile rurale sunt păstrate cu sfințenie, iar viața de zi cu zi reflectă un stil de viață autentic și tradițional.</li>
              <li style={liStyle}><strong>Bucovina:</strong> este un adevărat muzeu în aer liber, unde tradițiile religioase și culturale sunt păstrate de sute de ani, iar peisajele montane sunt spectaculoase.</li>

            
            </ul>
          </section>

          <section style={sectionStyle}>
            <h3 style={h3Style}>Întrebări interesante pentru tine</h3>
            <ul style={ulStyle}>
              <li style={liStyle}>Știați că Transilvania este faimoasă pentru cetățile sale medievale și pentru peisajele montane?</li>
              <li style={liStyle}>Care este regiunea din România pe care ai dori să o explorezi și de ce?</li>
              <li style={liStyle}>Crezi că tradițiile din Moldova sunt similare cu cele din alte regiuni din estul Europei?</li>
              <li style={liStyle}>Ai vrea să vizitezi Maramureș pentru a vedea bisericile din lemn și peisajele tradiționale?</li>
            </ul>
          </section>

          {/* Descrierea regiunii selectate */}
          {selectedRegion ? (
            <div style={selectedRegionStyle}>
              <h4>{selectedRegion.name}</h4>
              <p>{selectedRegion.description}</p>
            </div>
          ) : (
            <p>Selectează o regiune de pe hartă pentru a vizualiza detalii.</p>
          )}

          

          
        </div>



      </div>
      
    </div>
    
  );
}

export default App;
