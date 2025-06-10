import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();
  const [asteptari, setAsteptari] = useState([]);
  const [conturi, setConturi] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    fetch("/api/admin/user/unconfirmed", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          throw new Error("Neautorizat. Redirecționare spre login.");
        }
        return res.json();
      })
      .then((data) => {
        setAsteptari(data);
      })
      .catch((err) => {
        console.error("Eroare la încărcarea conturilor neconfirmate:", err);
        navigate("/");
      });
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    fetch("/api/admin/user/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Eroare la încărcarea conturilor complete");
        return res.json();
      })
      .then((data) => {
        setConturi(data);
      })
      .catch((err) => {
        console.error("Eroare la încărcarea tuturor conturilor:", err);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleConfirm = (id) => {
    const token = localStorage.getItem("authToken");

    fetch(`/api/admin/user/confirm/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Confirmarea a eșuat");
        setAsteptari((prev) => prev.filter((u) => u.id !== id));
      })
      .catch((err) => {
        console.error("Eroare la confirmare:", err);
      });
  };

  const handleReject = (id) => {
    const token = localStorage.getItem("authToken");

    fetch(`/api/admin/user/confirm/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Respingerea a eșuat");
        setAsteptari((prev) => prev.filter((u) => u.id !== id));
      })
      .catch((err) => {
        console.error("Eroare la respingere:", err);
      });
  };

  // ✅ Șterge un cont existent
  const handleDeleteUser = (id) => {
    const token = localStorage.getItem("authToken");

    if (!window.confirm("Ești sigur că vrei să ștergi acest cont?")) return;

    fetch(`/api/admin/user/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ștergerea a eșuat");
        setConturi((prev) => prev.filter((user) => user.id !== id));
      })
      .catch((err) => {
        console.error("Eroare la ștergerea contului:", err);
      });
  };

  // ✅ Template pentru butonul de ștergere
  const deleteButtonTemplate = (rowData) => (
    <Button
      icon="pi pi-times"
      className="p-button-danger"
      rounded
      tooltip="Șterge contul"
      onClick={() => handleDeleteUser(rowData.id)}
    />
  );

  const actiuniTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button icon="pi pi-check" severity="success" rounded onClick={() => handleConfirm(rowData.id)} />
    </div>
  );

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1>Panou Admin</h1>
        <Button
          label="Deconectare"
          icon="pi pi-sign-out"
          severity="danger"
          raised
          rounded
          className="p-button-lg"
          onClick={handleLogout}
          style={{ minWidth: "140px" }}
        />
      </div>

      <section style={{ marginBottom: 40 }}>
        <h2>Lista așteptări (conturi neconfirmate)</h2>
        <DataTable value={asteptari} paginator rows={5} responsiveLayout="scroll" emptyMessage="Nu există cereri">
          <Column field="id" header="ID" style={{ width: "5rem" }} />
          <Column field="email" header="Email" />
          <Column body={actiuniTemplate} header="Acțiuni" style={{ width: "10rem" }} />
        </DataTable>
      </section>

      <section>
        <h2>Toate conturile create</h2>
        <DataTable value={conturi} paginator rows={3} responsiveLayout="scroll" emptyMessage="Nu există conturi">
          <Column field="id" header="ID" style={{ width: "5rem" }} />
          <Column field="email" header="Email" />
          <Column body={deleteButtonTemplate} header="Șterge" style={{ width: "6rem" }} />
        </DataTable>
      </section>
    </div>
  );
}

export default Admin;
