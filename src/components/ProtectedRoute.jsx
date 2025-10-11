import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const user = localStorage.getItem('user');

    // Si no hay usuario logueado, redirige al login
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Si hay usuario, renderiza los hijos
    return children;
}
