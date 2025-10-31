// src/components/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h1>¡Bienvenido al sistema de posts! 👋</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
        Descubre posts interesantes y únete a las conversaciones
      </p>

      <Link to="/dashboard">
        <button
          style={{
            padding: "12px 24px",
            fontSize: "1.1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Ingresar al Dashboard
        </button>
      </Link>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginTop: "2rem",
          justifyContent: "center",
        }}
      >
        <Link to="/register">
          <button className="btn-outline-primary">Registrarse</button>
        </Link>
        <Link to="/login">
          <button className="btn-outline-success">Iniciar Sesión</button>
        </Link>
      </div>
    </div>
  );
}
