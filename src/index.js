import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginRegister from "./LoginRegister";
import MapPage from "./MapPage";
import Register from "./Register";
import AdminDashboard from "./admin";
import RegionPage from "./RegionPage"; 




ReactDOM.render(
  <Router>
    <Routes>

    <Route path="/" element={<LoginRegister />} />
    <Route path="/Register" element={<Register />} />
    <Route path="/map" element={<MapPage />} />
      <Route path="/" element={<App />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/region/:id" element={<RegionPage />} />
      
    </Routes>
  </Router>,
  document.getElementById("root")
);
