import React, { useContext } from 'react';
import { Route, Redirect, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return children ? children : <Outlet />
    }
    return <Navigate to='/login' />
}