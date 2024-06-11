import React, { useContext } from 'react';
import { Route, Redirect, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return children ? children : <Outlet />
    }
    console.log('Redirecting to login');
    return <Navigate to='/login' />
}