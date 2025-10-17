// src/components/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

export default function Dashboard() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Bienvenido al Dashboard</h1>
            {token ? (
                <>
                    <p>Sesión iniciada correctamente.</p>
                    <p><strong>Token JWT:</strong> {token.slice(0, 30)}...</p>
                    <Button label="Cerrar sesión" onClick={handleLogout} className="p-button-danger" />
                </>
            ) : (
                <p>No hay sesión activa.</p>
            )}
        </div>
    );
}
