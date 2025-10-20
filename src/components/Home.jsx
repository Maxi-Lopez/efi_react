// src/components/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to Home</h1>
      <p>Select an option:</p>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <Link to="/register">
          <button>Register</button>
        </Link>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
    </div>
  );
}