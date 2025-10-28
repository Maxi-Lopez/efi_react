// src/components/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ 
      padding: "2rem", 
      textAlign: "center", 
      maxWidth: "600px", 
      margin: "0 auto" 
    }}>
      <h1>¡Bienvenido a nuestra comunidad! 👋</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
        Descubre posts interesantes y únete a las conversaciones
      </p>
      
      <Link to="/dashboard">
        <button style={{
          padding: "12px 24px",
          fontSize: "1.1rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}>
          Ingresar al Dashboard
        </button>
      </Link>

      <div style={{ 
        display: "flex", 
        gap: "1rem", 
        marginTop: "2rem",
        justifyContent: "center" 
      }}>
        <Link to="/register">
          <button style={{
            padding: "8px 16px",
            backgroundColor: "transparent",
            border: "1px solid #007bff",
            borderRadius: "6px",
            cursor: "pointer"
          }}>
            Registrarse
          </button>
        </Link>
        <Link to="/login">
          <button style={{
            padding: "8px 16px",
            backgroundColor: "transparent",
            border: "1px solid #28a745",
            borderRadius: "6px",
            cursor: "pointer"
          }}>
            Iniciar Sesión
          </button>
        </Link>
      </div>
    </div>
  );
}