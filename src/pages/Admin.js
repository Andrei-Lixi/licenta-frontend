import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";


function Admin() {
  const navigate = useNavigate();

  // Date demo
  const lectii = [
    { id: 1, titlu: "Matematică - Algebra", profesor: "Ion Popescu", data: "2025-06-01" },
    { id: 2, titlu: "Istorie - Evul Mediu", profesor: "Maria Ionescu", data: "2025-06-02" },
  ];

  const quizuri = [
    { id: 1, titlu: "Quiz Algebra", lectieId: 1, dataCrearii: "2025-05-30" },
    { id: 2, titlu: "Quiz Evul Mediu", lectieId: 2, dataCrearii: "2025-05-31" },
  ];

  const conturi = [
    { id: 1, username: "profesor1", rol: "Profesor", status: "Activ" },
    { id: 2, username: "elev1", rol: "Elev", status: "Activ" },
    { id: 3, username: "admin", rol: "Admin", status: "Activ" },
  ];

  const asteptari = [
    { id: 1, username: "newuser1", cerere: "Înregistrare elev", dataCerere: "2025-06-01" },
    { id: 2, username: "newprof1", cerere: "Înregistrare profesor", dataCerere: "2025-06-02" },
  ];

  // Funcție de logout: șterge token, user și navighează spre login (sau principală)
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/"); // sau "/"
  };

  return (
    <div style={{ padding: 20 }}>
      

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1>Panou Admin</h1>
        <Button
            label="Deconectare"
            icon="pi pi-sign-out"
            severity="danger"      // roșu pentru acțiuni de atenționare/ștergere
            raised                // buton ridicat, cu umbră
            rounded               // colțuri rotunjite
            className="p-button-lg" // buton mai mare
            onClick={handleLogout}
            style={{ minWidth: '140px' }}
            />

      </div>

      <section style={{ marginBottom: 40 }}>
        <h2>Lista lecții</h2>
        <DataTable value={lectii} paginator rows={5} responsiveLayout="scroll" emptyMessage="Nu există lecții">
          <Column field="id" header="ID" style={{ width: "5rem" }}></Column>
          <Column field="titlu" header="Titlu lecție"></Column>
          <Column field="profesor" header="Profesor"></Column>
          <Column field="data" header="Data lecției"></Column>
        </DataTable>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>Lista quizuri</h2>
        <DataTable value={quizuri} paginator rows={5} responsiveLayout="scroll" emptyMessage="Nu există quizuri">
          <Column field="id" header="ID" style={{ width: "5rem" }}></Column>
          <Column field="titlu" header="Titlu quiz"></Column>
          <Column field="lectieId" header="ID lecție"></Column>
          <Column field="dataCrearii" header="Data creării"></Column>
        </DataTable>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>Lista conturi create</h2>
        <DataTable value={conturi} paginator rows={5} responsiveLayout="scroll" emptyMessage="Nu există conturi">
          <Column field="id" header="ID" style={{ width: "5rem" }}></Column>
          <Column field="username" header="Username"></Column>
          <Column field="rol" header="Rol"></Column>
          <Column field="status" header="Status"></Column>
        </DataTable>
      </section>

      <section>
        <h2>Lista așteptări</h2>
        <DataTable value={asteptari} paginator rows={5} responsiveLayout="scroll" emptyMessage="Nu există cereri">
          <Column field="id" header="ID" style={{ width: "5rem" }}></Column>
          <Column field="username" header="Username"></Column>
          <Column field="cerere" header="Cerere"></Column>
          <Column field="dataCerere" header="Data cererii"></Column>
        </DataTable>
      </section>
    </div>
  );
}

export default Admin;
