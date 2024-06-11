import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../common/ProtectedRoute';
import Dashboard from './Dashboard';
import Header from './Header'

import '../styles/Layout.css'

const Layout = () => {
    return (
        <div>
            <Header />
            <div className="sidebar-layout">
                <div className="page-layout">
                    <Routes>
                        <Route path="/*" element={
                            <ProtectedRoute>
                                <Navigate to="/dashboard" />
                            </ProtectedRoute>} />

                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </div>
        </div >
    );
};

export default Layout;
