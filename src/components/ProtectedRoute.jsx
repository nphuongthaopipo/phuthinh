import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const useAuth = () => {
    // This is a simple authentication check.
    // A real-world app might check a token's validity, not just its existence.
    const user = localStorage.getItem('access_token');
    return user ? true : false;
};

const ProtectedRoute = () => {
    const isAuth = useAuth();
    return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;